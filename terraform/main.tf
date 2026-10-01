terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_ecr_repository" "devshop" {
  name                 = "devshop-ecommerce"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "DevShop"
    Managed = "Terraform"
  }
}

output "ecr_repository_url" {
  value = aws_ecr_repository.devshop.repository_url
}