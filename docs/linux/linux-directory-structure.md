---
sidebar_position: 2
id: linux-directory-structure
title: โครงสร้างโฟลเดอร์ใน Linux (Ubuntu)
sidebar_label: 1. โครงสร้างโฟลเดอร์
description: อธิบายโครงสร้างและหน้าที่ของแต่ละโฟลเดอร์ใน Linux Ubuntu
---

# โครงสร้างโฟลเดอร์ใน Linux (Ubuntu)

Linux ใช้ระบบไฟล์แบบ **Filesystem Hierarchy Standard (FHS)** ซึ่งกำหนดโครงสร้างโฟลเดอร์มาตรฐานสำหรับระบบปฏิบัติการ Unix/Linux ทุกตัว โฟลเดอร์ทั้งหมดจะเริ่มต้นจาก **root** หรือ `/`

---

## ภาพรวมโครงสร้าง

```
/
├── bin/
├── boot/
├── dev/
├── etc/
├── home/
├── lib/
├── media/
├── mnt/
├── opt/
├── proc/
├── root/
├── run/
├── sbin/
├── srv/
├── sys/
├── tmp/
├── usr/
└── var/
```

---

## รายละเอียดแต่ละโฟลเดอร์

### `/` — Root Directory
โฟลเดอร์รากของระบบทั้งหมด ทุกไฟล์และโฟลเดอร์ในระบบจะอยู่ภายใต้ `/` ไม่ว่าจะอยู่บน partition หรืออุปกรณ์ใด

---

### `/bin` — Essential User Binaries
เก็บคำสั่งพื้นฐานที่จำเป็นสำหรับผู้ใช้ทั่วไป ซึ่งต้องใช้งานได้แม้ในโหมด single-user

**ตัวอย่างไฟล์:**
- `ls` — แสดงรายการไฟล์
- `cp` — คัดลอกไฟล์
- `mv` — ย้ายไฟล์
- `rm` — ลบไฟล์
- `bash` — shell หลัก

:::info 
หมายเหตุ
ใน Ubuntu เวอร์ชันใหม่ `/bin` เป็น symbolic link ไปยัง `/usr/bin`
:::

---

### `/boot` — Boot Loader Files
เก็บไฟล์ที่จำเป็นสำหรับการบูตระบบ เช่น Linux kernel และ bootloader

**ตัวอย่างไฟล์:**
- `vmlinuz` — Linux kernel
- `initrd.img` — Initial RAM disk
- `grub/` — ไฟล์การตั้งค่า GRUB bootloader

---

### `/dev` — Device Files
เก็บไฟล์ที่แทนอุปกรณ์ฮาร์ดแวร์ต่างๆ ใน Linux ทุกอย่างถูกมองเป็นไฟล์ รวมถึงอุปกรณ์ด้วย

**ตัวอย่าง:**
- `/dev/sda` — Hard disk ตัวแรก
- `/dev/sda1` — Partition แรกของ hard disk
- `/dev/null` — อุปกรณ์ทิ้งข้อมูล (ใช้ redirect output ที่ไม่ต้องการ)
- `/dev/tty` — Terminal

---

### `/etc` — Configuration Files
เก็บไฟล์การตั้งค่า (configuration) ของระบบและโปรแกรมต่างๆ ทั้งหมด

**ตัวอย่างไฟล์สำคัญ:**
- `/etc/passwd` — ข้อมูลบัญชีผู้ใช้
- `/etc/fstab` — การตั้งค่า mount ของ disk
- `/etc/hosts` — การ map hostname กับ IP
- `/etc/apt/` — การตั้งค่าของ package manager APT
- `/etc/ssh/` — การตั้งค่า SSH

---

### `/home` — User Home Directories
เก็บโฟลเดอร์ส่วนตัวของผู้ใช้แต่ละคน ผู้ใช้จะมีสิทธิ์เต็มในโฟลเดอร์ของตัวเอง

**โครงสร้าง:**
```
/home/
├── alice/
│   ├── Documents/
│   ├── Downloads/
│   └── .bashrc
└── bob/
    ├── Documents/
    └── .bashrc
```

---

### `/lib` — Essential Shared Libraries
เก็บ library ที่จำเป็นสำหรับโปรแกรมใน `/bin` และ `/sbin`

**ตัวอย่าง:**
- `libc.so` — C standard library
- `modules/` — kernel modules

:::info 
หมายเหตุ
ใน Ubuntu เวอร์ชันใหม่ `/lib` เป็น symbolic link ไปยัง `/usr/lib`
:::

---

### `/media` — Removable Media
จุด mount อัตโนมัติสำหรับอุปกรณ์ถอดได้ เช่น USB drive, CD-ROM

**ตัวอย่าง:**
```
/media/
└── username/
    ├── USB_DRIVE/
    └── CDROM/
```

---

### `/mnt` — Temporary Mount Points
จุด mount ชั่วคราวสำหรับ sysadmin ใช้ mount filesystem ด้วยตนเอง

---

### `/opt` — Optional Software
เก็บซอฟต์แวร์เพิ่มเติมที่ติดตั้งโดยผู้ใช้หรือ vendor ที่ไม่ได้มาจาก package manager

**ตัวอย่าง:**
- `/opt/google/chrome/`
- `/opt/vscode/`

---

### `/proc` — Process Information (Virtual)
เป็น virtual filesystem ที่ให้ข้อมูลเกี่ยวกับ process และ kernel ในแบบ real-time ไม่มีไฟล์จริงบน disk

**ตัวอย่าง:**
- `/proc/cpuinfo` — ข้อมูล CPU
- `/proc/meminfo` — ข้อมูล RAM
- `/proc/1234/` — ข้อมูล process ที่มี PID 1234

---

### `/root` — Root User Home
โฟลเดอร์ home ของ superuser (root) แยกออกจาก `/home` เพื่อความปลอดภัย

---

### `/run` — Runtime Data
เก็บข้อมูล runtime ของระบบตั้งแต่เริ่ม boot เช่น PID files และ socket files ข้อมูลจะถูกลบเมื่อ reboot

---

### `/sbin` — System Binaries
เก็บคำสั่งสำหรับ system administration ที่ต้องใช้สิทธิ์ root

**ตัวอย่าง:**
- `fdisk` — จัดการ disk partition
- `ifconfig` — ตั้งค่า network interface
- `reboot` — รีสตาร์ทระบบ
- `iptables` — จัดการ firewall

:::info 
หมายเหตุ
ใน Ubuntu เวอร์ชันใหม่ `/sbin` เป็น symbolic link ไปยัง `/usr/sbin`
:::

---

### `/srv` — Service Data
เก็บข้อมูลที่ให้บริการโดย server เช่น web server หรือ FTP server

**ตัวอย่าง:**
- `/srv/http/` — ไฟล์ของ web server
- `/srv/ftp/` — ไฟล์ของ FTP server

---

### `/sys` — System (Virtual)
เป็น virtual filesystem สำหรับเข้าถึงข้อมูลและตั้งค่าของ kernel และ hardware ในแบบ real-time

---

### `/tmp` — Temporary Files
เก็บไฟล์ชั่วคราวที่โปรแกรมสร้างขึ้นระหว่างใช้งาน ไฟล์เหล่านี้จะถูกลบเมื่อ reboot

:::warning 
ข้อควรระวัง
อย่าเก็บไฟล์สำคัญใน `/tmp` เพราะอาจถูกลบโดยอัตโนมัติ
:::

---

### `/usr` — Unix System Resources
เป็นโฟลเดอร์ที่ใหญ่ที่สุดในระบบ เก็บโปรแกรม library และไฟล์ข้อมูลส่วนใหญ่ที่ผู้ใช้ใช้งาน

**โครงสร้างย่อย:**

| โฟลเดอร์ | หน้าที่ |
|---|---|
| `/usr/bin` | คำสั่งสำหรับผู้ใช้ทั่วไป |
| `/usr/sbin` | คำสั่งสำหรับ admin |
| `/usr/lib` | Shared libraries |
| `/usr/local` | ซอฟต์แวร์ที่ compile เองในเครื่อง |
| `/usr/share` | ไฟล์ข้อมูลที่ใช้ร่วมกัน เช่น icons, docs |
| `/usr/include` | Header files สำหรับ C/C++ |

---

### `/var` — Variable Data
เก็บข้อมูลที่มีการเปลี่ยนแปลงบ่อยในระหว่างการทำงานของระบบ

**โครงสร้างย่อย:**

| โฟลเดอร์ | หน้าที่ |
|---|---|
| `/var/log` | ไฟล์ log ของระบบและโปรแกรม |
| `/var/cache` | ข้อมูล cache ของโปรแกรม |
| `/var/mail` | กล่องจดหมายของผู้ใช้ |
| `/var/spool` | คิวงาน เช่น print queue |
| `/var/www` | ไฟล์ของ web server (Apache/Nginx) |
| `/var/lib` | ข้อมูลสถานะของโปรแกรม |

---

## สรุปตารางโฟลเดอร์ทั้งหมด

| โฟลเดอร์ | หน้าที่หลัก |
|---|---|
| `/` | Root ของระบบทั้งหมด |
| `/bin` | คำสั่งพื้นฐานสำหรับผู้ใช้ |
| `/boot` | ไฟล์สำหรับบูตระบบ |
| `/dev` | ไฟล์อุปกรณ์ฮาร์ดแวร์ |
| `/etc` | ไฟล์ configuration ของระบบ |
| `/home` | โฟลเดอร์ส่วนตัวของผู้ใช้ |
| `/lib` | Shared libraries |
| `/media` | Mount point สำหรับ removable media |
| `/mnt` | Mount point ชั่วคราว |
| `/opt` | ซอฟต์แวร์เพิ่มเติม |
| `/proc` | ข้อมูล process (virtual) |
| `/root` | Home ของ root user |
| `/run` | ข้อมูล runtime |
| `/sbin` | คำสั่งสำหรับ system admin |
| `/srv` | ข้อมูลของ server services |
| `/sys` | ข้อมูล kernel และ hardware (virtual) |
| `/tmp` | ไฟล์ชั่วคราว |
| `/usr` | โปรแกรมและข้อมูลหลักของระบบ |
| `/var` | ข้อมูลที่เปลี่ยนแปลงบ่อย เช่น log |