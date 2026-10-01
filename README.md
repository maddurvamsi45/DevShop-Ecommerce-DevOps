# 🛒 DevShop — Professional E-Commerce DevOps Project

DevShop is a modern full-stack e-commerce practice project designed for DevOps learners.

## Features

- Responsive professional e-commerce UI
- Product search
- Category filtering
- Product detail modal
- Shopping cart
- Quantity controls
- Coupon simulation
- Checkout form
- Order confirmation
- REST APIs with Express
- Health-check endpoint
- Docker
- Docker Compose
- Jenkins CI/CD
- GitHub Actions CI/CD
- Kubernetes Deployment, Service and HPA
- Kustomize
- Terraform ECR example
- Automated tests

## Project Structure

```text
DevShop-Ecommerce-DevOps/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── tests/
│   └── test.js
├── k8s/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── hpa.yaml
│   └── kustomization.yaml
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/ci-cd.yml
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── package.json
└── server.js
```

## Run locally

```bash
npm install
npm start
```

Open:

http://localhost:3000

## Run with Docker

```bash
docker build -t devshop-ecommerce .
docker run -d --name devshop -p 3000:3000 devshop-ecommerce
```

## Docker Compose

```bash
docker compose up -d --build
```

Open:

http://localhost:3000

## Test

```bash
npm test
```

## GitHub Actions

Add these GitHub repository secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

Then push to `main`.

## Jenkins

1. Install Node.js and Docker on Jenkins agent.
2. Create Docker Hub credentials named `dockerhub-creds`.
3. Update `YOUR_DOCKERHUB_USERNAME` in Jenkinsfile.
4. Create a Pipeline job connected to GitHub.
5. Configure webhook if required.
6. Push code and run the pipeline.

## Kubernetes

Replace the image in `k8s/deployment.yaml`:

```yaml
image: YOUR_DOCKERHUB_USERNAME/devshop-ecommerce:latest
```

Deploy:

```bash
kubectl apply -k k8s/
kubectl get pods -n devshop
kubectl get svc -n devshop
kubectl get hpa -n devshop
```

For EKS:

```bash
aws eks update-kubeconfig --region ap-south-1 --name YOUR_EKS_CLUSTER
kubectl apply -k k8s/
```

## Terraform

The Terraform example creates an AWS ECR repository:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## DevOps Architecture

```text
Developer
   |
   v
GitHub
   |
   +------------------+
   |                  |
   v                  v
GitHub Actions      Jenkins
   |                  |
   +--------+---------+
            |
            v
       Docker Image
            |
            v
     Docker Hub / ECR
            |
            v
       Kubernetes
          /   \
       Pods    HPA
          |
          v
      DevShop App
          |
          v
       Customers
```

## Suggested next upgrades

- PostgreSQL or MongoDB
- Redis caching
- JWT authentication
- Admin dashboard
- Product database
- Payment gateway integration
- Prometheus metrics
- Grafana dashboard
- Argo CD GitOps deployment
- SonarQube quality gate
- Trivy image scanning
- Ingress + TLS
- AWS EKS production deployment

## Important

This project uses simulated checkout/order processing for learning. No real payment is processed.
