---
sidebar_position: 4
title: คู่มือการติดตั้ง Webmin
description: คู่มือการติดตั้ง Webmin บน Ubuntu Server ด้วยวิธี Setup Script  
---

# คู่มือการติดตั้ง Webmin

คู่มือการติดตั้ง Webmin บน Ubuntu Server ด้วยวิธี Setup Script

---

## 1. ดาวน์โหลดสคริปต์เวอร์ชันล่าสุด

ดาวน์โหลดสคริปต์ติดตั้งอัตโนมัติจาก Repository หลักของ Webmin (ระบุออปชัน -4 เพื่อบังคับใช้ IPv4)

```Bash
curl -4 -o webmin-setup-repo.sh https://raw.githubusercontent.com/webmin/webmin/master/webmin-setup-repo.sh
```

## 2. รันสคริปต์ผูกคลังระบบ (Repository)

รันสคริปต์เพื่อติดตั้ง GPG Key และเพิ่มแหล่งดาวน์โหลดของ Webmin เข้ามาในระบบ ขั้นตอนนี้ระบบจะถามรหัสผ่าน (Password) ของผู้ใช้งานเพื่อยืนยันสิทธิ์

```Bash
sudo sh webmin-setup-repo.sh
```
:::info
เมื่อระบบถามความต้องการติดตั้ง Setup Webmin stable repository? (y/N) ให้พิมพ์ y แล้วกด Enter
:::


## 3. อัปเดตรายชื่อแพ็กเกจของระบบ
สั่งให้ Ubuntu ดึงข้อมูลรายชื่อซอฟต์แวร์ล่าสุดจากคลังซอฟต์แวร์ของ Webmin ที่เพิ่งเพิ่มเข้าไปในขั้นตอนที่ 2
```Bash
sudo apt update
```

## 4. ดำเนินการติดตั้ง Webmin

สั่งติดตั้งโปรแกรม Webmin พร้อมทั้งดาวน์โหลดซอฟต์แวร์สนับสนุนที่จำเป็นทั้งหมดลงในเครื่อง

```Bash
sudo apt install --install-recommends webmin -y
```

## 5. เปิดพอร์ตบนระบบ Firewall (UFW)
เปิดสิทธิ์พอร์ตหมายเลข 10000 เพื่ออนุญาตให้คอมพิวเตอร์เครื่องอื่นสามารถรีโมทเข้ามาจัดการเซิร์ฟเวอร์ผ่านหน้าเว็บได้

```bash
sudo ufw allow 10000/tcp
sudo ufw reload
```

## 6. การตรวจสอบสถานะการทำงาน (Verification)
ตรวจสอบว่าบริการของ Webmin เปิดใช้งานและทำงานอยู่เบื้องหลังเรียบร้อยแล้ว

```bash
sudo systemctl status webmin
```

## วิธีการเข้าใช้งาน (Access Link)
เปิด Web Browser บนคอมพิวเตอร์ของคุณ แล้วพิมพ์ URL ดังนี้:
```Plaintext
https://<หมายเลข_IP_ของเซิร์ฟเวอร์>:10000
```

:::warning
ข้อควรระวังในคู่มือ: เมื่อเข้าหน้าเว็บครั้งแรก บราวเซอร์จะแจ้งเตือนความปลอดภัย (SSL Warning) ให้ผู้ปฏิบัติงานคลิกที่ "Advanced" (ขั้นสูง) และเลือก "Proceed to... / ยอมรับความเสี่ยงและดำเนินการต่อ" เพื่อเข้าสู่หน้าล็อกอินหลัก
:::

