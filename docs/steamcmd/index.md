---
sidebar_position: 4
title: คู่มือการติดตั้ง SteamCMD
description: คู่มือการติดตั้ง SteamCMD บน Ubuntu Server
---

# คู่มือการติดตั้ง SteamCMD

SteamCMD เป็นเครื่องมือ Command-Line สำหรับดาวน์โหลดและอัปเดต Dedicated Server ของเกมต่าง ๆ บน Steam

---

:::warning
ข้อควรระวังสำคัญด้านความปลอดภัย (Security Warning):
ห้ามรันหรือติดตั้ง SteamCMD ภายใต้สิทธิ์บัญชีผู้ใช้ root โดยเด็ดขาด คู่มือนี้จะใช้บัญชีผู้ใช้เฉพาะกลุ่มชื่อ gameserver ในการทำงานทั้งหมดเพื่อความปลอดภัยของระบบหลัก
:::

## 1. เปิดการทำงานสถาปัตยกรรม 32-bit และเตรียมระบบ
เนื่องจาก SteamCMD ทำงานบนระบบ 32-bit (i386) เป็นหลัก เราต้องสั่งให้ Ubuntu Server รองรับแพ็กเกจข้ามสถาปัตยกรรมก่อน

```bash
sudo dpkg --add-architecture i386
```
```bash
sudo apt update
```

## 2. ติดตั้ง Dependencies ที่จำเป็น
ติดตั้งตัวไลบรารี 32-bit และเครื่องมือจัดการคลังซอฟต์แวร์ที่โปรแกรมจำเป็นต้องใช้ในการรันระบบ

```bash
sudo apt install software-properties-common python3-software-properties -y
```
```bash
sudo apt install lib32gcc-s1 lib32stdc++6 libsdl2-2.0-0:i386 -y
```

## 3. เปิดคลัง Multiverse และติดตั้ง SteamCMD
### 3.1 เปิดคลังซอฟต์แวร์ประเภท Multiverse ซึ่งเป็นคลังที่เป็นทางการของแพ็กเกจ SteamCMD
```bash
sudo add-apt-repository multiverse
```
```bash
sudo apt update
```

### 3.2 ดำเนินการติดตั้งแพ็กเกจ steamcmd
```bash
sudo apt install steamcmd -y
```
ระหว่างการติดตั้งจะปรากฏหน้าจอข้อตกลงสิทธิ์การใช้งาน (EULA):
 - 3.2.1 หน้าจอแรกให้กดปุ่ม Tab บนคีย์บอร์ดเพื่อเลื่อนไฮไลท์ไปที่ปุ่ม [ OK ] แล้วกด Enter
 - 3.2.2 หน้าจอถัดไปให้เลื่อนไปเลือก [ I AGREE ] (ยอมรับเงื่อนไข) แล้วกด Enter

## 4. สร้างสิทธิ์บัญชีผู้ใช้
สร้างบัญชีผู้ใช้ใหม่สำหรับใช้รันและเก็บไฟล์เกมเซิร์ฟเวอร์ทั้งหมดแยกออกจากสิทธิ์ของแอดมิน
### 4.1 สร้าง User ใหม่ชื่อ gameserver พร้อมระบุให้สร้างโฟลเดอร์ Home ในตัว
```bash
sudo useradd -m -s /bin/bash gameserver
```
### 4.2 กำหนดรหัสผ่านให้กับ User gameserver
```bash
sudo passwd gameserver
```

## 5. สลับบัญชีและทดสอบการรัน SteamCMD
### 5.1 สลับบัญชีผู้ใช้ปัจจุบันไปเป็นบัญชี gameserver เพื่อความปลอดภัยก่อนเริ่มรัน
```bash
su - gameserver
```
### 5.2 สร้างลิงก์เชื่อมโยงไฟล์ระบบ (Symlink) เพื่อให้ User นี้สามารถเรียกใช้งานคำสั่ง steamcmd ได้สมบูรณ์
```bash
mkdir -p ~/.steam/sdk32
```
```bash
ln -s /usr/games/steamcmd ~/.steam/sdk32/steamcmd
```

### 5.3 ทดสอบเปิดใช้งานโปรแกรม
```bash
steamcmd
```