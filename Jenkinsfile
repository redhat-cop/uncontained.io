@Library('cop-library') _

openshift.withCluster() {
  env.localToken = readFile('/var/run/secrets/kubernetes.io/serviceaccount/token').trim()
  env.NAMESPACE = openshift.project()
}

//n.notifyBuild('STARTED', rocketchat_url)

pipeline {
  agent {
    label 'hugo-builder'
  }

  stages {
    stage ('Fetch Source Code') {
      steps {
        script {
        hygieiaBuildPublishStep buildStatus: 'InProgress'
        git url: "${APPLICATION_SOURCE_REPO}", branch: "${APPLICATION_SOURCE_REF}"

        }
      }
    }

    stage ('Build Site from Source') {
      steps {
        container('builder') {
          sh 'bundle install'
          sh 'npm install'
          sh 'npm run build'
        }
      }
      post {
        failure {
          hygieiaBuildPublishStep buildStatus: 'Failure'
        }
        aborted {
          hygieiaBuildPublishStep buildStatus: 'Aborted'
        }
        success {
          hygieiaBuildPublishStep buildStatus: 'Success'
        }
      }
    }

    stage ('Build and Test in Parallel') {
      parallel {
        stage ('Run Automated Tests') {
          steps {
            container('builder') {
              sh 'npm test'
            }
          }
        }

        stage ('Build Container Image') {
          steps {
            script {
              openshift.withCluster() {
                openshift.withProject() {
                  openshift.selector("bc", "${APP_NAME}").startBuild("--from-dir=dist").logs("-f")
                }
              }
            }
          }
        }
      }
    }

    stage ('Deploy to Dev'){
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              echo "Promoting via tag from ${NAMESPACE} to ${DEV_NAMESPACE}/${APP_NAME}"
              tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${DEV_NAMESPACE}", toImageName: "${APP_NAME}", toImageTag: "latest")
            }
          }
        }
      }
    }

    stage ('Verify Deployment to Dev') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject("${DEV_NAMESPACE}"){
              // Verify all pods come up healthy
              def dcObj = openshift.selector('dc', APP_NAME).object()
              def podSelector = openshift.selector('pod', [deployment: "${APP_NAME}-${dcObj.status.latestVersion}"])
              podSelector.untilEach {
                  echo "pod: ${it.name()}"
                  return it.object().status.containerStatuses[0].ready
              }

              // Smoke Test
              def routeObj = openshift.selector('route', APP_NAME).object()
              def proto = 'http://'
              if (routeObj.spec.tls != null) {
                proto = 'https://'
              }
              env.TEST_URL = "${proto}${routeObj.spec.host}"
            }
          }
        }
        container('builder') {
          sh "export TEST_URL=${env.TEST_URL} && npm run smoke"
        }
      }
      post {
        success {
          hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${DEV_NAMESPACE}", buildStatus: 'Success', environmentName: "${DEV_NAMESPACE}"
        }
      }
    }

    stage('Promotions') {
      agent {
        kubernetes {
          label 'promotion-slave'
          cloud 'openshift'
          serviceAccount 'jenkins'
          containerTemplate {
            name 'jnlp'
            image "docker-registry.default.svc:5000/${NAMESPACE}/jenkins-slave-image-mgmt"
            alwaysPullImage true
            workingDir '/tmp'
            args '${computer.jnlpmac} ${computer.name}'
            ttyEnabled false
          }
        }
      }
      stages {
        stage('Promote to Test') {
          steps {
            script {
              openshift.withCluster() {
                openshift.withProject() {
                  echo "Promoting via tag from ${NAMESPACE} to ${TEST_NAMESPACE}/${APP_NAME}"
                  tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${TEST_NAMESPACE}", toImageName: "${APP_NAME}", toImageTag: "latest")
                }
              }
              sh 'mkdir -p dist/ && touch dist/index.html'
              hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${TEST_NAMESPACE}", buildStatus: 'Success', environmentName: "${TEST_NAMESPACE}"
            }
          }
        }

        stage('Promote to Stage') {
          steps {
            script {
              openshift.withCluster() {
                openshift.withProject() {
                  echo "Promoting via tag from ${NAMESPACE} to ${STAGE_NAMESPACE}/${APP_NAME}"
                  tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${STAGE_NAMESPACE}", toImageName: "${APP_NAME}", toImageTag: "latest")
                }
              }
              sh 'mkdir -p dist/ && touch dist/index.html'
              hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${STAGE_NAMESPACE}", buildStatus: 'Success', environmentName: "${STAGE_NAMESPACE}"
            }
          }
        }

        stage('Promote to Prod') {
          when {
            beforeAgent true
            allOf{
              environment name: 'APPLICATION_SOURCE_REF', value: 'master';
              environment name: 'APPLICATION_SOURCE_REPO', value: 'https://github.com/redhat-cop/uncontained.io.git'
            }
          }
          steps {
            script {
              openshift.withCluster() {
                def secretData = openshift.selector('secret/other-cluster-credentials').object().data
                def encodedRegistry = secretData.registry
                def encodedToken = secretData.token
                def encodedAPI = secretData.api
                env.registry = sh(script:"set +x; echo ${encodedRegistry} | base64 --decode", returnStdout: true)
                env.token = sh(script:"set +x; echo ${encodedToken} | base64 --decode", returnStdout: true)
                env.api = sh(script:"set +x; echo ${encodedAPI} | base64 --decode", returnStdout: true)

                openshift.withProject() {
                  def imageRegistry = openshift.selector( 'is', "${APP_NAME}").object().status.dockerImageRepository
                  echo "Promoting ${imageRegistry} -> ${registry}/${PROD_NAMESPACE}/${APP_NAME}"
                  sh """
                  set +x
                  skopeo copy --remove-signatures \
                    --src-creds openshift:${localToken} --src-cert-dir=/run/secrets/kubernetes.io/serviceaccount/ \
                    --dest-creds openshift:${token}  --dest-tls-verify=false \
                    docker://${imageRegistry} docker://${registry}/${PROD_NAMESPACE}/${APP_NAME}
                  """
                  sh 'mkdir -p dist/ && touch dist/index.html'
                  hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${PROD_NAMESPACE}", buildStatus: 'Success', environmentName: "${PROD_NAMESPACE}"
                }
              }
            }
          }
        }
      }
    }
  }
  /*
  post {
    success {
      script {

        //n.notifyBuild('SUCCESSFUL', rocketchat_url)
      }
    }
    failure {
      script {
        //n.notifyBuild('FAILED', rocketchat_url)
      }
    }
  }*/

}
