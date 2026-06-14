---
sidebar_position: 4
title: คู่มือการติดตั้ง SteamCMD
description: คู่มือการติดตั้งและตั้งค่า SteamCMD บน Linux Ubuntu เพื่อดาวน์โหลดและจัดการ Steam Game Servers พร้อมการตั้งค่า Firewall (UFW)
---

# คู่มือการติดตั้ง SteamCMD

SteamCMD (Steam Console Client) เป็น Command-line version ของ Steam Client ที่ใช้สำหรับติดตั้ง ดาวน์โหลด และจัดการ Steam Game Servers อย่างอัตโนมัติ โดยไม่ต้องเปิด GUI

---

## 1. ความต้องการระบบ (System Requirements)

### 1.1 ข้อกำหนดพื้นฐาน

| ข้อกำหนด | รายละเอียด |
|---------|----------|
| CPU | x86 หรือ x64 (ไม่รองรับ ARM) |
| RAM | อย่างน้อย 512MB (แนะนำ 2GB ขึ้นไป) |
| Disk Space | ขึ้นอยู่กับเกม (CS2: ~30GB, TF2: ~30GB) |
| OS | Ubuntu 16.04 LTS ขึ้นไป (แนะนำ 20.04 / 22.04 / 24.04) |
| Network | Connection เสถียร (ค่ายเหนือ 10Mbps) |

:::warning
**SteamCMD เป็น 32-bit tool** จึงต้องติดตั้ง 32-bit libraries (`i386`) แม้ว่าระบบเป็น 64-bit ก็ตาม
:::

### 1.2 ไฟล์ Log ที่ต้องตรวจสอบ

| ไฟล์ | ที่อยู่ | ความหมาย |
|-----|--------|---------|
| `bootstraplinux32.log` | `~/steamcmd/` | Log จากการ Install SteamCMD |
| Server Log | Game Directory | Log จากการรัน Game Server |

---

## 2. ขั้นตอนการติดตั้ง SteamCMD

### 2.1 อัพเดต Package Repository

```bash
# อัพเดต Package List
sudo apt update

# อัพเดต Installed Packages
sudo apt upgrade -y
```

### 2.2 เปิดใช้งาน 32-bit Architecture (i386)

เนื่องจาก SteamCMD เป็น 32-bit tool ต้องเปิดใช้ i386 Architecture:

```bash
# เพิ่ม i386 Architecture
sudo dpkg --add-architecture i386

# ยืนยันการเพิ่ม
sudo apt update
```

**ตรวจสอบ:**

```bash
# ดู Architecture ที่รองรับ
dpkg --print-architecture
dpkg --print-foreign-architectures
```

**ผลลัพธ์ที่ถูกต้อง:**

```
amd64
i386
```

### 2.3 เปิดใช้งาน Multiverse Repository

SteamCMD อยู่ใน Multiverse Repository (เนื่องจาก Proprietary):

```bash
# เพิ่ม Multiverse Repository
sudo add-apt-repository multiverse -y

# อัพเดต Package List
sudo apt update
```

### 2.4 ติดตั้ง Dependencies

```bash
# ติดตั้ง 32-bit C++ Runtime (สำคัญที่สุด)
sudo apt install lib32gcc-s1 lib32stdc++6 -y

# ติดตั้ง 32-bit Libraries เพิ่มเติม
sudo apt install libc6:i386 -y

# ติดตั้ง wget และ curl (สำหรับดาวน์โหลด)
sudo apt install wget curl -y
```

### 2.5 ติดตั้ง SteamCMD

```bash
# ติดตั้งตรงจาก Repository
sudo apt install steamcmd -y
```

:::tip
SteamCMD จะติดตั้งไปที่ `/usr/games/steamcmd` โดย Default
:::

**ตรวจสอบการติดตั้ง:**

```bash
# ดู Version
steamcmd --version

# หรือ
/usr/games/steamcmd
```

---

## 3. การตั้งค่า Steam User (สำหรับ Production)

สำหรับ Server ที่รันจริง ควรสร้าง Dedicated User เพื่อความปลอดภัย:

### 3.1 สร้าง Steam User

```bash
# สร้าง User ชื่อ 'steam' พร้อม Home Directory
sudo useradd -m -s /bin/bash steam

# ตั้ง Password (Optional)
sudo passwd steam

# เปลี่ยนเป็น Steam User
su - steam
```

### 3.2 สร้าง Directory สำหรับ SteamCMD

```bash
# สร้าง Directory
mkdir -p ~/steamcmd
cd ~/steamcmd
```

### 3.3 ดาวน์โหลด SteamCMD Manually (ถ้าต้องการ)

```bash
# ดาวน์โหลด
wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz

# Extract
tar -xvzf steamcmd_linux.tar.gz

# ลบไฟล์ .tar.gz
rm steamcmd_linux.tar.gz
```

---

## 4. การใช้งาน SteamCMD

### 4.1 รัน SteamCMD ในโหมด Interactive

```bash
# เปิด SteamCMD Console
steamcmd

# หรือใช้ Path เต็ม
/usr/games/steamcmd
```

**Commands ที่สำคัญ:**

| Command | ความหมาย |
|---------|----------|
| `help` | ดูคำสั่งทั้งหมด |
| `login anonymous` | เข้าสู่ระบบแบบ Anonymous (ไม่ต้อง Password) |
| `login username password` | เข้าสู่ระบบด้วย Username และ Password |
| `app_update [appid]` | ดาวน์โหลด/อัพเดต Game Server |
| `app_update [appid] validate` | ดาวน์โหลด + ตรวจสอบไฟล์ |
| `quit` | ออกจาก SteamCMD |

### 4.2 ดาวน์โหลด Game Server ด้วย Script

ใช้คำสั่งทั้งหมดในบรรทัดเดียว (Batch Mode):

```bash
# ตัวอย่าง: ดาวน์โหลด Counter-Strike 2 (CS2)
steamcmd +login anonymous \
  +force_install_dir ~/cs2-server \
  +app_update 730 validate \
  +quit
```

**อธิบาย:**

| Part | ความหมาย |
|------|---------|
| `+login anonymous` | เข้าสู่ระบบแบบ Anonymous |
| `+force_install_dir ~/cs2-server` | ระบุ Path ที่ต้องการติดตั้ง |
| `+app_update 730` | ดาวน์โหลด App ID 730 (CS2) |
| `validate` | ตรวจสอบไฟล์หลังดาวน์โหลด |
| `+quit` | ออกหลังเสร็จ |

### 4.3 App IDs ของเกม Popular

| เกม | App ID | Command |
|-----|--------|---------|
| Counter-Strike 2 (CS:GO) | 730 | `app_update 730 validate` |
| Dota 2 | 570 | `app_update 570 validate` |
| Team Fortress 2 (TF2) | 440 | `app_update 440 validate` |
| Left 4 Dead 2 | 500 | `app_update 500 validate` |
| Rust | 1391110 | `app_update 1391110 validate` |
| Ark: Survival Evolved | 376030 | `app_update 376030 validate` |
| Minecraft Server | 1679730 | `app_update 1679730 validate` |

:::tip
ดู [Steam App IDs](https://steamdb.info/) สำหรับรายการเกม App IDs ที่สมบูรณ์
:::

### 4.4 Script ตัวอย่าง: ดาวน์โหลด CS2

```bash
#!/bin/bash
# install-cs2.sh

INSTALL_DIR="$HOME/cs2-server"

echo "Installing Counter-Strike 2 Server..."

steamcmd +login anonymous \
  +force_install_dir "$INSTALL_DIR" \
  +app_update 730 validate \
  +quit

echo "Installation complete at $INSTALL_DIR"
ls -la "$INSTALL_DIR"
```

**ใช้งาน:**

```bash
chmod +x install-cs2.sh
./install-cs2.sh
```

### 4.5 Update Game Server

```bash
# Update CS2 Server
steamcmd +login anonymous \
  +force_install_dir ~/cs2-server \
  +app_update 730 validate \
  +quit

# โดยปกติสามารถ Schedule ด้วย Cron:
# 0 3 * * 1 /home/steam/update-cs2.sh  # ทุกวันจันทร์ 03:00 AM
```

---

## 5. ปัญหาที่พบบ่อยและวิธีแก้ไข

### 6.1 Error: `libstdc++.so.6: cannot open shared object file`

**สาเหตุ:** 32-bit C++ Library ไม่ติดตั้ง

**วิธีแก้:**

```bash
sudo apt install lib32stdc++6 -y
sudo apt install lib32gcc-s1 -y
```

### 6.2 Error: `Login Failure: No Connection`

**สาเหตุ:** Firewall ปิดกั้น Port หรือการเชื่อมต่อ Outbound

**วิธีแก้:**

```bash
# ตรวจสอบ Port เปิด
sudo ss -tulpn | grep 27015

# ปิด UFW ชั่วคราวเพื่อทดสอบ
sudo ufw disable
# รัน SteamCMD ทดสอบ
steamcmd ...
# เปิด UFW กลับ
sudo ufw enable

# ตรวจสอบ DNS หรือ Network
ping 8.8.8.8
```

### 6.3 Server ไม่ปรากฏใน Server Browser

**สาเหตุ:** 
- ยังไม่ Allow Port ใน Firewall
- Game Server ไม่ได้ติดตั้งถูกต้อง
- Server Config ผิด

**วิธีแก้:**

```bash
# ทดสอบ Port เปิดหรือไม่
sudo ss -tulpn | grep 27015

# ทดสอบการเชื่อมต่อจากเครื่องอื่น
nc -zv YOUR_SERVER_IP 27015

# ดู Server Logs
tail -f ~/cs2-server/game/csgo/logs/console.log
```

### 6.4 SteamCMD Stuck ในการดาวน์โหลด

**วิธีแก้:**

```bash
# ลบไฟล์ Download Cache
rm -rf ~/steamcmd/linux32

# ลองใหม่
steamcmd +login anonymous +app_update 730 validate +quit
```

---

## 6. Best Practices

### 7.1 Security

```bash
# 1. ห้ามรัน SteamCMD เป็น Root
# ใช้ Steam User แทน
su - steam
steamcmd ...

# 2. Restrict Firewall (Allow เฉพาะจาก IP ที่ต้องการ)
sudo ufw allow from 192.168.1.0/24 to any port 27015 tcp

# 3. Monitor Logs
tail -f ~/cs2-server/game/csgo/console.log

# 4. Backup Server Files
tar -czf cs2-backup-$(date +%Y%m%d).tar.gz ~/cs2-server/
```

### 7.2 Performance

```bash
# 1. ให้ Server มี Dedicated Core
# สามารถใช้ taskset:
taskset -c 0,1 ~/cs2-server/srcds_run ...

# 2. Optimize Network
# ดู MTU Setting
ip link show

# 3. Monitor Resource
watch -n 1 "ps aux | grep srcds"
```

### 7.3 Automation Script

```bash
#!/bin/bash
# weekly-update-cs2.sh

LOG_FILE="/var/log/cs2-update.log"
INSTALL_DIR="$HOME/cs2-server"

echo "[$(date)]" >> $LOG_FILE

# Stop Server
pkill -f srcds_run >> $LOG_FILE 2>&1

# Update
steamcmd +login anonymous \
  +force_install_dir "$INSTALL_DIR" \
  +app_update 730 validate \
  +quit >> $LOG_FILE 2>&1

# Start Server
cd "$INSTALL_DIR"
./srcds_run -console -game csgo ... >> $LOG_FILE 2>&1 &

echo "Update complete" >> $LOG_FILE
```

**ตั้งเป็น Cron Job:**

```bash
# แก้ไข Crontab
crontab -e

# เพิ่มบรรทัด (ทุกวันจันทร์ 03:00 AM)
0 3 * * 1 /home/steam/weekly-update-cs2.sh
```

---

## 7. สรุป

| งาน | คำสั่ง |
|-----|--------|
| ติดตั้ง SteamCMD | `sudo apt install steamcmd -y` |
| ดาวน์โหลด CS2 Server | `steamcmd +login anonymous +force_install_dir ~/cs2-server +app_update 730 validate +quit` |
| ดาวน์โหลด Dota 2 Server | `steamcmd +login anonymous +force_install_dir ~/dota2-server +app_update 570 validate +quit` |
| ดาวน์โหลด TF2 Server | `steamcmd +login anonymous +force_install_dir ~/tf2-server +app_update 440 validate +quit` |
| ดาวน์โหลด Rust Server | `steamcmd +login anonymous +force_install_dir ~/rust-server +app_update 1391110 validate +quit` |
| ตรวจสอบ Server เปิด | `sudo ss -tulpn \| grep 27015` |
| Update Server | `steamcmd +login anonymous +force_install_dir ~/cs2-server +app_update 730 validate +quit` |