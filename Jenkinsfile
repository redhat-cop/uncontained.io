@Library('cop-library') _

openshift.withCluster() {
  env.NAMESPACE = openshift.project()

  env.localToken = readFile('/var/run/secrets/kubernetes.io/serviceaccount/token').trim()

  def secretData = openshift.selector('secret/other-cluster-credentials').object().data
  def encodedRegistry = secretData.registry
  def encodedToken = secretData.token
  def encodedAPI = secretData.api
  env.registry = sh(script:"set +x; echo ${encodedRegistry} | base64 --decode", returnStdout: true)
  env.token = sh(script:"set +x; echo ${encodedToken} | base64 --decode", returnStdout: true)
  env.api = sh(script:"set +x; echo ${encodedAPI} | base64 --decode", returnStdout: true)
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

        def groupVars = readYaml file: '.applier/group_vars/all.yml'

        env.ci_cd_namespace = """${groupVars.ci_cd_namespace}"""
        env.dev_namespace = """${groupVars.dev_namespace}"""
        env.test_namespace = """${groupVars.test_namespace}"""
        env.stage_namespace = """${groupVars.stage_namespace}"""
        env.APP_NAME = """${groupVars.app_name}"""
        env.production_namespace = """${groupVars.prod_namespace}"""

        }
      }
    }

    stage ('Build Site from Source') {
      steps {
        container('builder') {
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

    stage ('Deploy to Dev'){
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              echo "Promoting via tag from ${NAMESPACE} to ${dev_namespace}/${APP_NAME}"
              tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${dev_namespace}", toImageName: "${APP_NAME}", toImageTag: "latest")
            }
          }
        }
      }
    }

    stage ('Verify Deployment to Dev') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject("${dev_namespace}"){
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
          hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${dev_namespace}", buildStatus: 'Success', environmentName: "${dev_namespace}"
        }
      }
    }

    stage('Promote to Test') {
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
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              echo "Promoting via tag from ${NAMESPACE} to ${test_namespace}/${APP_NAME}"
              tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${test_namespace}", toImageName: "${APP_NAME}", toImageTag: "latest")
            }
          }
          sh 'mkdir dist/'
          sh 'touch dist/index.html'
          hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${test_namespace}", buildStatus: 'Success', environmentName: "${test_namespace}"
        }
      }
    }

    stage('Promote to Stage') {
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
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              echo "Promoting via tag from ${NAMESPACE} to ${stage_namespace}/${APP_NAME}"
              tagImage(sourceImagePath: "${NAMESPACE}", sourceImageName: "${APP_NAME}", toImagePath: "${stage_namespace}", toImageName: "${APP_NAME}", toImageTag: "latest")
            }
          }
          sh 'mkdir dist/'
          sh 'touch dist/index.html'
          hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${stage_namespace}", buildStatus: 'Success', environmentName: "${stage_namespace}"
        }
      }
    }

    stage('Promote to Prod') {
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
      steps {
        script {
          openshift.withCluster() {

            openshift.withProject() {
              def imageRegistry = openshift.selector( 'is', "${APP_NAME}").object().status.dockerImageRepository
              echo "Promoting ${imageRegistry} -> ${registry}/${production_namespace}/${APP_NAME}"
              sh """
              set +x
              skopeo copy --remove-signatures \
                --src-creds openshift:${localToken} --src-cert-dir=/run/secrets/kubernetes.io/serviceaccount/ \
                --dest-creds openshift:${token}  --dest-tls-verify=false \
                docker://${imageRegistry} docker://${registry}/${production_namespace}/${APP_NAME}
              """
              sh 'mkdir dist/ && touch dist/index.html'
              hygieiaDeployPublishStep applicationName: "${APP_NAME}", artifactDirectory: 'dist/', artifactGroup: 'uncontained.io', artifactName: 'index.html', artifactVersion: "${BUILD_NUMBER}-${production_namespace}", buildStatus: 'Success', environmentName: "${production_namespace}"
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
