---
sidebar_position: 4
id: linux-system-services
title: คำสั่งควบคุมระบบและบริการ (Services) ใน Linux (Ubuntu)
sidebar_label: 3. ควบคุมระบบและ Services
description: คำสั่งสำหรับควบคุมระบบ จัดการ Services และ Process ใน Linux Ubuntu อย่างละเอียด
---

# คำสั่งควบคุมระบบและบริการ (Services) ใน Linux (Ubuntu)

Linux ใช้ **systemd** เป็น init system หลักในการจัดการ services และ process ต่างๆ ของระบบ การเข้าใจคำสั่งเหล่านี้จะช่วยให้ดูแลและควบคุมระบบได้อย่างมีประสิทธิภาพ

---

## 1. การควบคุมระบบ (System Control)

### ปิด / รีสตาร์ทระบบ

```bash
# รีสตาร์ทระบบทันที
sudo reboot

# ปิดเครื่องทันที
sudo poweroff
sudo shutdown -h now

# ปิดเครื่องหลังจาก 10 นาที
sudo shutdown -h +10

# ปิดเครื่องเวลาที่กำหนด (23:30)
sudo shutdown -h 23:30

# รีสตาร์ทหลังจาก 5 นาที
sudo shutdown -r +5

# ยกเลิกคำสั่ง shutdown ที่ตั้งเวลาไว้
sudo shutdown -c
```

---

### ดูข้อมูลระบบ

```bash
# ดูเวลาที่ระบบทำงานมา
uptime

# ดูข้อมูลระบบโดยรวม
uname -a

# ดูเฉพาะชื่อ OS
uname -s

# ดูเฉพาะ kernel version
uname -r

# ดูข้อมูล Ubuntu version
lsb_release -a
cat /etc/os-release

# ดูชื่อ hostname
hostname

# เปลี่ยน hostname
sudo hostnamectl set-hostname new-hostname

# ดูข้อมูล hardware โดยรวม
sudo lshw -short

# ดูข้อมูล CPU
lscpu
cat /proc/cpuinfo

# ดูข้อมูล RAM
free -h
cat /proc/meminfo

# ดูอุณหภูมิ CPU (ต้องติดตั้ง sensors)
sudo apt install lm-sensors
sensors
```

---

### ดูการใช้งานระบบแบบ Real-time

```bash
# แสดง process และการใช้ CPU/RAM แบบ real-time
top

# แบบ interactive ที่ดีกว่า top (ต้องติดตั้ง)
sudo apt install htop
htop

# ดูการใช้งาน disk I/O แบบ real-time
sudo apt install iotop
sudo iotop

# ดูการใช้งาน network แบบ real-time
sudo apt install nethogs
sudo nethogs
```

**คีย์ควบคุม `htop`:**

| ปุ่ม | การทำงาน |
|---|---|
| `F2` | Settings |
| `F3` | ค้นหา process |
| `F4` | Filter process |
| `F5` | แสดงแบบ tree |
| `F6` | เรียงลำดับ |
| `F9` | Kill process |
| `F10` | ออกจากโปรแกรม |
| `q` | ออกจากโปรแกรม |

---

## 2. การจัดการ Process

### `ps` — ดูรายการ Process

```bash
# ดู process ของตัวเอง
ps

# ดูทุก process ในระบบ
ps aux

# ดู process แบบ tree
ps auxf

# ดู process ที่ระบุชื่อ
ps aux | grep nginx

# ดู process ตาม PID
ps -p 1234

# ดูเฉพาะคอลัมน์ที่ต้องการ
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu
```

**คำอธิบายคอลัมน์ `ps aux`:**

| คอลัมน์ | ความหมาย |
|---|---|
| `USER` | เจ้าของ process |
| `PID` | Process ID |
| `%CPU` | การใช้งาน CPU |
| `%MEM` | การใช้งาน RAM |
| `VSZ` | Virtual memory (KB) |
| `RSS` | RAM จริงที่ใช้ (KB) |
| `STAT` | สถานะ process |
| `START` | เวลาที่เริ่ม |
| `TIME` | CPU time สะสม |
| `COMMAND` | คำสั่งที่รัน |

---

### `kill` — หยุด Process

```bash
# หยุด process ด้วย PID (ส่ง SIGTERM — รอให้จบเอง)
kill 1234

# บังคับหยุดทันที (ส่ง SIGKILL)
kill -9 1234

# หยุด process ตามชื่อ
killall nginx

# บังคับหยุดตามชื่อ
killall -9 nginx

# หยุด process แบบ interactive
pkill nginx

# ดู signal ทั้งหมดที่มี
kill -l
```

**Signal ที่ใช้บ่อย:**

| Signal | หมายเลข | ความหมาย |
|---|---|---|
| `SIGHUP` | 1 | Reload config |
| `SIGINT` | 2 | Interrupt (Ctrl+C) |
| `SIGKILL` | 9 | บังคับหยุดทันที |
| `SIGTERM` | 15 | หยุดแบบ graceful |
| `SIGSTOP` | 19 | หยุดชั่วคราว |
| `SIGCONT` | 18 | ทำงานต่อ |

---

### การจัดการ Process เบื้องหลัง (Background)

```bash
# รัน process เบื้องหลัง
command &

# ดู process เบื้องหลังทั้งหมด
jobs

# นำ process เบื้องหลังมาทำงานเบื้องหน้า
fg %1

# ส่ง process เบื้องหน้าไปเบื้องหลัง
# กด Ctrl+Z ก่อน แล้วพิมพ์
bg %1

# รัน process ที่ไม่หยุดแม้ปิด terminal
nohup command &

# ดู output ของ nohup
tail -f nohup.out
```

---

### `nice` และ `renice` — กำหนด Priority ของ Process

```bash
# รัน process ด้วย priority ต่ำ (nice: -20 ถึง 19, ยิ่งมากยิ่งลำดับต่ำ)
nice -n 10 command

# เปลี่ยน priority ของ process ที่กำลังทำงาน
sudo renice -n -5 -p 1234

# เปลี่ยน priority ของทุก process ของ user
sudo renice -n 5 -u username
```

---

## 3. การจัดการ Services ด้วย systemd

### `systemctl` — คำสั่งหลักสำหรับจัดการ Services

#### เริ่ม / หยุด / รีสตาร์ท Service

```bash
# เริ่ม service
sudo systemctl start nginx

# หยุด service
sudo systemctl stop nginx

# รีสตาร์ท service
sudo systemctl restart nginx

# Reload config โดยไม่หยุด service
sudo systemctl reload nginx

# Restart เฉพาะเมื่อ service กำลังทำงาน
sudo systemctl reload-or-restart nginx
```

---

#### ดูสถานะ Service

```bash
# ดูสถานะของ service
sudo systemctl status nginx

# ดูว่า service กำลังทำงานอยู่หรือไม่
sudo systemctl is-active nginx

# ดูว่า service เปิดตอน boot หรือไม่
sudo systemctl is-enabled nginx

# ดูว่า service ล้มเหลวหรือไม่
sudo systemctl is-failed nginx
```

**ตัวอย่างผลลัพธ์ `systemctl status nginx`:**
```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Mon 2024-01-10 09:00:00 +07; 2h ago
    Process: 1234 ExecStart=/usr/sbin/nginx
   Main PID: 1234 (nginx)
      Tasks: 2 (limit: 4915)
     Memory: 5.6M
        CPU: 120ms
```

---

#### เปิด / ปิด Service อัตโนมัติเมื่อ Boot

```bash
# เปิดให้ service เริ่มอัตโนมัติเมื่อ boot
sudo systemctl enable nginx

# เปิดและเริ่ม service ทันที
sudo systemctl enable --now nginx

# ปิดไม่ให้ service เริ่มอัตโนมัติ
sudo systemctl disable nginx

# ปิดและหยุด service ทันที
sudo systemctl disable --now nginx

# ล็อก service ไม่ให้เริ่มได้เลย
sudo systemctl mask nginx

# ปลดล็อก service
sudo systemctl unmask nginx
```

---

#### ดูรายการ Services ทั้งหมด

```bash
# ดู service ทั้งหมดที่กำลังทำงาน
sudo systemctl list-units --type=service

# ดู service ทั้งหมด (รวมที่ไม่ได้ทำงาน)
sudo systemctl list-units --type=service --all

# ดู service ที่ล้มเหลว
sudo systemctl --failed

# ดู service ที่เปิด boot อัตโนมัติ
sudo systemctl list-unit-files --type=service
```

---

### Services ที่ใช้บ่อยใน Ubuntu

| Service | คำสั่ง | หน้าที่ |
|---|---|---|
| Web Server | `nginx` / `apache2` | ให้บริการเว็บ |
| Database | `mysql` / `postgresql` | จัดการฐานข้อมูล |
| SSH | `ssh` | Remote access |
| Firewall | `ufw` | ควบคุม firewall |
| Cron | `cron` | รันงานตามเวลา |
| Network | `NetworkManager` | จัดการ network |
| Docker | `docker` | Container runtime |

```bash
# ตัวอย่างการจัดการ services ที่ใช้บ่อย
sudo systemctl status nginx
sudo systemctl restart mysql
sudo systemctl enable ssh
sudo systemctl stop apache2
```

---

## 4. การดู Log ของระบบ

### `journalctl` — ดู Log ของ systemd

```bash
# ดู log ทั้งหมด
sudo journalctl

# ดู log แบบ real-time
sudo journalctl -f

# ดู log ของ service ที่ระบุ
sudo journalctl -u nginx

# ดู log ของ service แบบ real-time
sudo journalctl -u nginx -f

# ดู log ตั้งแต่ boot ครั้งล่าสุด
sudo journalctl -b

# ดู log ของ boot ก่อนหน้า
sudo journalctl -b -1

# ดู log ในช่วงเวลาที่กำหนด
sudo journalctl --since "2024-01-10 09:00:00"
sudo journalctl --since "2024-01-10" --until "2024-01-11"

# ดูเฉพาะ log ระดับ error
sudo journalctl -p err

# ดู 50 บรรทัดล่าสุด
sudo journalctl -n 50

# ดู log ขนาด disk ที่ใช้
sudo journalctl --disk-usage

# ล้าง log เก่ากว่า 7 วัน
sudo journalctl --vacuum-time=7d
```

**ระดับ Priority ของ Log:**

| ระดับ | หมายเลข | ความหมาย |
|---|---|---|
| `emerg` | 0 | ระบบใช้งานไม่ได้ |
| `alert` | 1 | ต้องแก้ไขทันที |
| `crit` | 2 | วิกฤต |
| `err` | 3 | ข้อผิดพลาด |
| `warning` | 4 | คำเตือน |
| `notice` | 5 | ข้อมูลสำคัญ |
| `info` | 6 | ข้อมูลทั่วไป |
| `debug` | 7 | ข้อมูล debug |

---

### ไฟล์ Log สำคัญใน `/var/log`

```bash
# Log ของระบบทั่วไป
tail -f /var/log/syslog

# Log การ authentication (login/sudo)
tail -f /var/log/auth.log

# Log ของ kernel
tail -f /var/log/kern.log

# Log ของ apt (การติดตั้ง package)
cat /var/log/apt/history.log

# Log ของ nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Log ของ MySQL
tail -f /var/log/mysql/error.log
```

---

## 5. การจัดการ Cron Jobs (งานอัตโนมัติตามเวลา)

### `crontab` — ตั้งเวลารันคำสั่ง

```bash
# แก้ไข crontab ของผู้ใช้ปัจจุบัน
crontab -e

# ดู crontab ของผู้ใช้ปัจจุบัน
crontab -l

# ลบ crontab ทั้งหมด
crontab -r

# แก้ไข crontab ของ user อื่น (ต้องใช้ root)
sudo crontab -u username -e
```

**รูปแบบ Crontab:**

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── วันในสัปดาห์ (0-7, 0 และ 7 = อาทิตย์)
│ │ │ └──── เดือน (1-12)
│ │ └────── วันในเดือน (1-31)
│ └──────── ชั่วโมง (0-23)
└────────── นาที (0-59)
```

**ตัวอย่าง Cron Jobs:**

```bash
# รันทุกนาที
* * * * * /path/to/script.sh

# รันทุกวัน เวลา 02:30
30 2 * * * /path/to/backup.sh

# รันทุกวันจันทร์ เวลา 09:00
0 9 * * 1 /path/to/weekly_report.sh

# รันทุกวันที่ 1 ของเดือน เวลา 00:00
0 0 1 * * /path/to/monthly_task.sh

# รันทุก 15 นาที
*/15 * * * * /path/to/check.sh

# รันทุก 6 ชั่วโมง
0 */6 * * * /path/to/sync.sh

# รันเวลา 08:00 และ 20:00
0 8,20 * * * /path/to/script.sh
```

---

## 6. การจัดการ Network Services

### ดูและจัดการ Network

```bash
# ดู network interface ทั้งหมด
ip addr show
ip a

# ดูเฉพาะ interface ที่ระบุ
ip addr show eth0

# ดู routing table
ip route show

# ดูการเชื่อมต่อที่กำลังใช้งาน
ss -tuln

# ดู port ที่เปิดอยู่
ss -tulnp

# ดูการเชื่อมต่อ TCP ทั้งหมด
ss -tan

# ทดสอบการเชื่อมต่อ
ping google.com
ping -c 4 google.com    # ping 4 ครั้งแล้วหยุด

# ตรวจสอบ DNS
nslookup google.com
dig google.com

# ดู network traffic แบบ real-time
sudo apt install iftop
sudo iftop
```

---

### `ufw` — จัดการ Firewall

```bash
# ดูสถานะ firewall
sudo ufw status
sudo ufw status verbose

# เปิด firewall
sudo ufw enable

# ปิด firewall
sudo ufw disable

# อนุญาต port
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# อนุญาตด้วยชื่อ service
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# บล็อก port
sudo ufw deny 8080

# ลบ rule
sudo ufw delete allow 80

# อนุญาตเฉพาะ IP ที่ระบุ
sudo ufw allow from 192.168.1.100

# อนุญาต IP เข้าถึง port ที่ระบุ
sudo ufw allow from 192.168.1.100 to any port 22

# รีเซ็ต firewall ทั้งหมด
sudo ufw reset
```

---

## 7. การจัดการ Package (ซอฟต์แวร์)

### `apt` — Package Manager ของ Ubuntu

```bash
# อัปเดต package list
sudo apt update

# อัปเกรด package ทั้งหมด
sudo apt upgrade

# อัปเดตและอัปเกรดพร้อมกัน
sudo apt update && sudo apt upgrade -y

# ติดตั้ง package
sudo apt install nginx

# ติดตั้งหลาย package พร้อมกัน
sudo apt install nginx mysql-server php

# ลบ package
sudo apt remove nginx

# ลบ package พร้อม config files
sudo apt purge nginx

# ลบ package ที่ไม่ได้ใช้งาน
sudo apt autoremove

# ค้นหา package
apt search nginx

# ดูข้อมูล package
apt show nginx

# ดูรายการ package ที่ติดตั้งแล้ว
apt list --installed

# ล้าง cache ของ apt
sudo apt clean
sudo apt autoclean
```

---

## 8. การตรวจสอบสุขภาพระบบ (System Health)

```bash
# ดูสรุปสถานะระบบ
systemctl status

# ดู service ที่ล้มเหลวทั้งหมด
systemctl --failed

# ดูเวลา boot และ service ที่ใช้เวลานาน
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain

# ดูการใช้งาน RAM โดยละเอียด
free -h
vmstat -s

# ดูการใช้งาน CPU
mpstat
iostat

# ดู load average
uptime
cat /proc/loadavg

# ดูข้อมูล disk
lsblk
fdisk -l
```

---

## สรุปคำสั่งที่ใช้บ่อย

| คำสั่ง | หน้าที่ |
|---|---|
| `sudo systemctl start <service>` | เริ่ม service |
| `sudo systemctl stop <service>` | หยุด service |
| `sudo systemctl restart <service>` | รีสตาร์ท service |
| `sudo systemctl status <service>` | ดูสถานะ service |
| `sudo systemctl enable <service>` | เปิด auto-start |
| `sudo systemctl disable <service>` | ปิด auto-start |
| `sudo journalctl -u <service> -f` | ดู log แบบ real-time |
| `ps aux` | ดูทุก process |
| `kill -9 <PID>` | บังคับหยุด process |
| `htop` | ดูระบบแบบ real-time |
| `sudo ufw status` | ดูสถานะ firewall |
| `sudo apt update && sudo apt upgrade` | อัปเดตระบบ |
| `crontab -e` | แก้ไข cron jobs |
| `sudo reboot` | รีสตาร์ทระบบ |
| `uptime` | ดูเวลาที่ระบบทำงาน |