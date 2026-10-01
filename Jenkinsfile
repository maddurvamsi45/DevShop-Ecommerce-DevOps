pipeline {
    agent any

    environment {
        IMAGE_NAME = "YOUR_DOCKERHUB_USERNAME/devshop-ecommerce"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }

        stage("Test") {
            steps {
                sh "npm test"
            }
        }

        stage("Docker Build") {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage("Docker Push") {
            when {
                branch "main"
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "dockerhub-creds",
                    usernameVariable: "DOCKER_USER",
                    passwordVariable: "DOCKER_PASS"
                )]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage("Deploy") {
            when {
                branch "main"
            }
            steps {
                echo "Deploy stage: connect this step to Kubernetes/EKS."
            }
        }
    }

    post {
        always {
            echo "DevShop pipeline completed: ${currentBuild.currentResult}"
        }
    }
}