#!/bin/bash

# deploy.sh - Deployment script for Movie Management App

set -e

# Configuration
DOCKER_HUB_USERNAME=${DOCKER_HUB_USERNAME:-"yourdockerhub"}
IMAGE_NAME="movies"
VERSION=${VERSION:-"latest"}
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${VERSION}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Build Docker image
build_image() {
    log_info "Building Docker image: ${FULL_IMAGE_NAME}"
    
    docker build \
        --build-arg VITE_API_URL=${API_URL:-http://localhost:8000/api/v1} \
        -t ${FULL_IMAGE_NAME} \
        .
    
    log_success "Image built successfully"
}

# Test the image locally
test_image() {
    log_info "Testing the image locally..."
    
    # Stop any existing container
    docker stop movies-test 2>/dev/null || true
    docker rm movies-test 2>/dev/null || true
    
    # Run test container
    docker run -d \
        --name movies-test \
        -p 3001:3000 \
        -e API_URL=${API_URL:-http://localhost:8000/api/v1} \
        ${FULL_IMAGE_NAME}
    
    # Wait for container to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        docker logs movies-test
        docker stop movies-test
        docker rm movies-test
        exit 1
    fi
    
    # Cleanup test container
    docker stop movies-test
    docker rm movies-test
    
    log_success "Image test completed successfully"
}

# Push to Docker Hub
push_image() {
    log_info "Pushing image to Docker Hub..."
    
    # Check if logged in to Docker Hub
    if ! docker info | grep -q "Username:"; then
        log_warning "Not logged in to Docker Hub. Please run: docker login"
        read -p "Do you want to continue with docker login? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker login
        else
            log_error "Cannot push without Docker Hub authentication"
            exit 1
        fi
    fi
    
    docker push ${FULL_IMAGE_NAME}
    log_success "Image pushed to Docker Hub: ${FULL_IMAGE_NAME}"
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production..."
    
    # Example production deployment
    # Replace this with your actual production deployment logic
    
    docker run -d \
        --name movies-prod \
        -p 80:3000 \
        -e API_URL=${PRODUCTION_API_URL:-https://api.yourdomain.com/v1} \
        --restart unless-stopped \
        ${FULL_IMAGE_NAME}
    
    log_success "Production deployment completed"
}

# Main function
main() {
    log_info "🚀 Starting deployment process for Movie Management App"
    
    # Parse command line arguments
    case "${1:-build}" in
        "build")
            check_docker
            build_image
            ;;
        "test")
            check_docker
            test_image
            ;;
        "push")
            check_docker
            build_image
            test_image
            push_image
            ;;
        "deploy")
            check_docker
            build_image
            test_image
            push_image
            deploy_production
            ;;
        "full")
            check_docker
            build_image
            test_image
            push_image
            log_info "Full deployment completed. Run with 'deploy' to deploy to production."
            ;;
        *)
            echo "Usage: $0 {build|test|push|deploy|full}"
            echo ""
            echo "Commands:"
            echo "  build  - Build Docker image"
            echo "  test   - Test the built image"
            echo "  push   - Build, test, and push to Docker Hub"
            echo "  deploy - Full deployment including production"
            echo "  full   - Build, test, and push (no production deployment)"
            echo ""
            echo "Environment variables:"
            echo "  DOCKER_HUB_USERNAME - Your Docker Hub username"
            echo "  API_URL - API endpoint for testing"
            echo "  PRODUCTION_API_URL - API endpoint for production"
            echo "  VERSION - Image version tag (default: latest)"
            exit 1
            ;;
    esac
    
    log_success "🎉 Deployment process completed successfully!"
}

# Run main function
main "$@"