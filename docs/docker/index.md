---
sidebar_position: 4
title: คู่มือการติดตั้ง Docker
description: คู่มือการติดตั้ง Docker
---

# คู่มือการติดตั้ง Docker

นี่คือคู่มือการติดตั้ง Docker และ Docker Compose บน Ubuntu Server อย่างละเอียดตามมาตรฐานสากล (Official APT Repository) ซึ่งใช้วิธีผูกคลังเก็บซอฟต์แวร์ของ Docker โดยตรง เพื่อให้มั่นใจว่าจะได้ซอฟต์แวร์เวอร์ชันล่าสุด ปลอดภัย และสามารถใช้คำสั่ง apt upgrade เพื่ออัปเดตระบบในอนาคตได้ทันที
---

## 1. ล้างเศษไฟล์ Docker เวอร์ชันเก่า (หากมี)

หากเซิร์ฟเวอร์เคยถูกติดตั้ง Docker เวอร์ชันเก่าหรือแบบไม่เป็นทางการค้างไว้ ให้รันคำสั่งนี้เพื่อเคลียร์ระบบให้สะอาดก่อน (หากเป็นเครื่องใหม่เอี่ยม คำสั่งนี้จะไม่ส่งผลเสียใด ๆ)

```Bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg -y; done
```

## 2. อัปเดตระบบและติดตั้งเครื่องมือพื้นฐาน

อัปเดตรายชื่อแพ็กเกจของ Ubuntu และติดตั้งเครื่องมือที่จำเป็นสำหรับการดาวน์โหลดและยืนยันคีย์ความปลอดภัยของซอฟต์แวร์

```Bash
sudo apt-get update
```
```Bash
sudo apt-get install ca-certificates curl gnupg -y
```

## 3. เพิ่ม Docker Official GPG Key
สร้างโฟลเดอร์สำหรับเก็บคีย์ความปลอดภัย และดาวน์โหลด GPG Key อย่างเป็นทางการจากผู้พัฒนา Docker เพื่อใช้ยืนยันความถูกต้องของซอฟต์แวร์
```Bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

## 4. ผูกคลังซอฟต์แวร์หลัก (Docker Repository)

รันคำสั่งด้านล่างนี้เพื่อบันทึกที่อยู่คลังซอฟต์แวร์ (Repository) ของ Docker ลงในระบบ Ubuntu โดยตัวระบบจะทำการตรวจเช็กเวอร์ชันและสถาปัตยกรรมของเซิร์ฟเวอร์ให้อัตโนมัติ

```Bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/legal/iptables || . /etc/os-release; echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## 5. เริ่มต้นติดตั้ง Docker และ Docker Compose
หลังจากเพิ่มคลังเรียบร้อยแล้ว ให้ทำการอัปเดตดัชนีแพ็กเกจอีกครั้ง เพื่อให้ Ubuntu รู้จัก Docker แล้วสั่งติดตั้งตัวโปรแกรมหลักทั้งหมดพร้อมกัน

```bash
# 1. อัปเดตรายชื่อแพ็กเกจใหม่
sudo apt-get update

# 2. ติดตั้ง Docker Engine, CLI, Containerd และ Docker Compose V2
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

## 6. ตรวจสอบสถานะการทำงาน (Verification)
### 6.1 เช็กสถานะ Service ของ Docker
```bash
sudo systemctl status docker
```
ผลลัพธ์ที่ถูกต้อง: ต้องขึ้นสถานะตัวอักษรสีเขียวว่า active (running)

### 6.2 ทดสอบรัน Container ตัวอย่าง
```bash
sudo docker run hello-world
```

### 6.3 เช็กเวอร์ชันของ Docker และ Docker Compose
```bash
docker --version
docker compose version
```

## 7. ตั้งค่าให้ Docker รันโดยไม่ต้องใช้ sudo (ทางเลือกเสริม)
โดยปกติคำสั่ง Docker จะต้องใช้ sudo นำหน้าเสมอเพื่อความปลอดภัย หากต้องการให้บัญชีผู้ใช้ปัจจุบัน (เช่น บัญชีผู้ดูแลระบบ) สามารถพิมพ์สั่ง docker ได้ตรง ๆ ให้เพิ่มผู้ใช้นั้นเข้ากลุ่ม docker ดังนี้:
```bash
# 1. สร้างกลุ่มชื่อ docker (ปกติระบบจะสร้างให้แล้ว)
sudo groupadd docker

# 2. เพิ่ม User ปัจจุบันเข้าไปในกลุ่ม docker
sudo usermod -aG docker $USER
```
:::warning
ข้อสำคัญหลังจากรันขั้นตอนนี้: ผู้ปฏิบัติงานจำเป็นต้อง Log out ออกจากระบบเซิร์ฟเวอร์ แล้ว Log in เข้ามาใหม่ หรือพิมพ์คำสั่ง newgrp docker เพื่อให้สิทธิ์ใหม่มีผลใช้งานครับ
:::