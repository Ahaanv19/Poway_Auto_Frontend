---
toc: true
layout: post
title: Deployment Guide
description: A guide to our deployment
permalink: /deployment/
comments: true
categories: [Installation & Setup]
---


# 📢 **Poway Auto Deployment Guide: Step-by-Step**

> **Welcome to the official deployment guide for our project!** 🚀 This guide provides an exhaustive step-by-step walkthrough for deploying our backend to AWS using EC2, Docker, and Cockpit. It demonstrates the exact steps we will follow in order for succesful deployment. Diagrams at the bottom, and the first three steps are the crucial ones. 

---

## 📌 **Step 1: Clone & Configure Project**

1. **Clone Your Repository**
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git my_backend
```
Example:
```sh
git clone https://github.com/Ahaanv19/sprint4_flocker_backend.git
```

2. **Navigate into the Project**
```sh
cd my_backend
```

3. **Create `.env` File** (WE DO NOT COMMIT THIS FILE!)
```sh
touch .env
nano .env
```
💡 **Example `.env` structure: We will decide on a password and username just our example**
```
SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://user:password@localhost/dbname
DEBUG=True
```
Press `CTRL + X`, then `Y`, then `Enter` to save.

4. **Initialize Database**
```sh
./scripts/db_init.py
```

---

## 📌 **Step 2: Run Your Application with Docker**

1. **Build Docker Image**
```sh
docker-compose build
```

2. **Run Docker Containers in Detached Mode**
```sh
docker-compose up -d
```

3. **Verify Running Containers**
```sh
docker ps
```
✅ **Look for your application and its assigned port.**

4. **Test if the Server is Running**
```sh
curl localhost:8103
```
✅ **If successful, you'll see an HTTP response from your Flask backend.**

---



## 📌 **Step 3: Post-Deployment Checks & Monitoring**

### 🔹 **Check Logs**
```sh
docker logs -f CONTAINER_ID
```

### 🔹 **Check Application Health**
```sh
curl http://OUR_DOMAIN_OR_IP
```

### 🔹 **Monitor Performance**
Use [Cockpit Backdoor](https://cockpit.stu.nighthawkcodingsociety.com/) for system health and logs.

### Test you DNS server
**You can test in any terminal (MacOs, WSL, or AWS).  Be sure it command returns IP address in answer section. Example result below**

<img src="{{site.baseurl}}/images/e.png" alt="Deployment Process Overview">

## Deployment Diagram and Ubuntu
<img src="{{site.baseurl}}/images/d.png" alt="Deployment Process Overview">
    
<img src="{{site.baseurl}}/images/a.png" alt="Deployment Process Overview">


## 📌 **Final Notes, Security Best Practices, & Reference Steps for Future Use**

✅ **WE DO NOT commit `.env` files or sensitive credentials.**

✅ **Regularly check logs & server health via Cockpit.**

## Reference Steps Below 
**These steps are for our reference, focus only on the steps 1,2, and 3, these steps can possibly causes issues but is still useful for future reference. DO NOT WITHOUT PERMISSION USE THESE STEPS!!!**

## 📌 **Reference Step: Initial Setup and Accessing AWS EC2**

### 🔹 **: Get Your AWS EC2 Credentials**

1. **Access AWS EC2 Console:**
   - Navigate to [AWS EC2 Dashboard](https://console.aws.amazon.com/ec2/).
   - Ensuring we are using the correct AWS region (e.g., `us-west-1`).
   
2. **Locate or Create an EC2 Instance:**
   - If you already have an instance running, find its **Public IPv4 Address** under **Instances**.
   - If you need to create a new one:
     - Click **Launch Instance**
     - Choose **Ubuntu 22.04 LTS**
     - Select instance type: `t2.micro` (free-tier eligible)
     - Configure key pair (download `.pem` file!)
     - Allow inbound traffic (ports `22`, `8080`, `443`, etc.)
     - Click **Launch**

3. **Find Your EC2 Public IP**
   - Go to **Instances → Your Instance → Details**
   - Copy **Public IPv4 Address** 

### 🔹 **Step 1.2: Accessing EC2 via SSH**

💡 **Use Cockpit for easier management:** [Cockpit Backdoor](https://cockpit.stu.nighthawkcodingsociety.com/)

Alternatively, use SSH:
```sh
ssh -i /path/to/my-key.pem ubuntu@YOUR_INSTANCE_IP
```
Example:
```sh
ssh -i ~/.ssh/aws_key.pem ubuntu@18.234.56.78
```

✅ **Success Check:** You should now be inside the EC2 terminal!

---

## 📌**Reference Step: Initial Server Setup**

1. **Update & Upgrade Packages**
```sh
sudo apt update && sudo apt upgrade -y
```

2. **Install Required Software**
```sh
sudo apt install -y git docker.io docker-compose
```

3. **Start & Enable Docker**
```sh
sudo systemctl enable docker
sudo systemctl start docker
```

4. **Verify Docker Installation**
```sh
docker --version
```
✅ **Expected Output:** `Docker version XX.XX.XX`

---


## 📌 **Reference Step: Route Setup: Route53 Domain Setup (Optional)**

1. **Go to [AWS Route 53](https://console.aws.amazon.com/route53/)**
2. **Register a domain name**
3. **Create an A Record:**
   - Name: `@`
   - Type: `A`
   - Value: `OUR_INSTANCE_IP`

#### This is an example, DON'T USE ANY INFO BESIDES VALUE, just use for example

<img src="{{site.baseurl}}/images/h.png" alt="Deployment Process Overview">

   
   
## 📌**Reference Step Expose the Application to the Internet**

1. **Find Your Instance’s Public IP**
```sh
echo $(curl -s ifconfig.me)
```
✅ **Copy the output and use it to test in a browser!**

2. **Allow Traffic on Port 8103 (Our specfied port number)**
```sh
sudo ufw allow 8103/tcp
sudo ufw enable
```

3. **Test Access from Your Machine**
```sh
curl http://OUR_INSTANCE_IP:8103
```
✅ **Expected: Flask server response.**

4. **Set Up Reverse Proxy (Optional, for Nginx Support)**
```sh
sudo apt install nginx -y
```

5. **Configure Nginx**
```sh
sudo nano /etc/nginx/sites-available/my_backend
```
💡 **Example Nginx Config:**
```
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:8805;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```