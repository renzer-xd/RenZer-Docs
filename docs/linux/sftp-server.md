---
sidebar_position: 11
title: การตั้งค่าและใช้งาน SFTP Server
sidebar_label: 10. การตั้งค่าและใช้งาน SFTP Server
description: คู่มือการติดตั้งและตั้งค่า SFTP Server บน Ubuntu อย่างละเอียด ครอบคลุม Chroot Jail, SSH Key ส่วนกลาง และการใช้งานกับ Client ต่างๆ
tags: [sftp, ssh, security, linux, ubuntu]
---

# การตั้งค่าและใช้งาน SFTP Server

SFTP (SSH File Transfer Protocol) คือโปรโตคอลสำหรับถ่ายโอนไฟล์อย่างปลอดภัยผ่านการเข้ารหัสของ SSH ต่างจาก FTP แบบเดิมที่ส่งข้อมูลแบบ plaintext ซึ่งดักอ่านได้

:::info 
SFTP ≠ FTP over SSH
SFTP เป็นโปรโตคอลที่แตกต่างจาก FTP โดยสิ้นเชิง ไม่ใช่แค่ FTP ที่เข้ารหัส SFTP ถูกสร้างมาเป็นส่วนหนึ่งของ SSH protocol suite และใช้ port เดียว (22) แทนที่จะต้องเปิดหลาย port เหมือน FTP
:::

## SFTP vs FTP เปรียบเทียบ

| คุณสมบัติ | SFTP | FTP |
|---|---|---|
| การเข้ารหัส | ✅ ทั้ง credentials และข้อมูล | ❌ Plaintext |
| Port | 22 (port เดียว) | 20, 21 (หลาย port) |
| Firewall-friendly | ✅ ง่าย | ❌ ยุ่งยาก |
| Authentication | Password / SSH Key | Password |
| รองรับ Resume | ✅ | ขึ้นอยู่กับ client |

---

## ภาพรวมสถาปัตยกรรม

```
┌─────────────────────────────────────────────────┐
│                  Ubuntu Server                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │           OpenSSH (sshd)                │   │
│  │                                         │   │
│  │  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │  SSH Shell   │  │  SFTP Subsystem│  │   │
│  │  │  (port 22)   │  │  (internal-sftp│  │   │
│  │  └──────────────┘  └────────────────┘  │   │
│  │                                         │   │
│  │  Global AuthorizedKeysFile              │   │
│  │  /etc/ssh/sftp_keys/global              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  /var/sftp/                                     │
│  ├── user1/   (chroot jail)                     │
│  ├── user2/   (chroot jail)                     │
│  └── uploads/ (shared folder)                  │
└─────────────────────────────────────────────────┘
```

---

## ขั้นตอนที่ 1: ติดตั้ง OpenSSH Server

Ubuntu ส่วนใหญ่มี OpenSSH ติดมาแล้ว ตรวจสอบและติดตั้ง:

```bash
# ตรวจสอบว่ามี OpenSSH หรือยัง
dpkg -l | grep openssh-server

# ติดตั้ง (ถ้ายังไม่มี)
sudo apt update
sudo apt install openssh-server -y

# เปิดใช้งานและสตาร์ท
sudo systemctl enable ssh
sudo systemctl start ssh

# ตรวจสอบสถานะ
sudo systemctl status ssh
```

---

## ขั้นตอนที่ 2: สร้าง Group และ User สำหรับ SFTP

การแยก SFTP user ออกจาก system user ทั่วไปเป็น best practice ด้านความปลอดภัย

### สร้าง Group

```bash
# สร้าง group สำหรับ SFTP users ทั้งหมด
sudo groupadd sftpusers
```

### สร้าง SFTP User

```bash
# สร้าง user ที่เข้าถึงได้เฉพาะ SFTP (ไม่มี shell)
sudo useradd -m -G sftpusers -s /usr/sbin/nologin sftpuser1
sudo useradd -m -G sftpusers -s /usr/sbin/nologin sftpuser2

# ตั้ง password (ถ้าต้องการ login ด้วย password)
sudo passwd sftpuser1
sudo passwd sftpuser2
```

:::tip 
ทำไมต้องใช้ `/usr/sbin/nologin`
การกำหนด shell เป็น `/usr/sbin/nologin` ทำให้ user ไม่สามารถ login เข้า SSH shell ได้ เข้าถึงได้เฉพาะ SFTP เท่านั้น เพิ่มความปลอดภัยให้กับระบบ
:::

---

## ขั้นตอนที่ 3: สร้างโครงสร้าง Directory

### รูปแบบที่ 1: แยก Directory ต่อ User

```bash
# สร้าง root directory สำหรับ SFTP (ต้องเป็นเจ้าของโดย root)
sudo mkdir -p /var/sftp

# สร้าง directory ของแต่ละ user
sudo mkdir -p /var/sftp/sftpuser1
sudo mkdir -p /var/sftp/sftpuser2

# กำหนด owner ของ root directory เป็น root (สำคัญมาก!)
sudo chown root:root /var/sftp/sftpuser1
sudo chown root:root /var/sftp/sftpuser2
sudo chmod 755 /var/sftp/sftpuser1
sudo chmod 755 /var/sftp/sftpuser2

# สร้าง subdirectory ที่ user จะ upload/download ได้
sudo mkdir -p /var/sftp/sftpuser1/files
sudo mkdir -p /var/sftp/sftpuser2/files

# กำหนด owner ของ subdirectory เป็น user นั้นๆ
sudo chown sftpuser1:sftpusers /var/sftp/sftpuser1/files
sudo chown sftpuser2:sftpusers /var/sftp/sftpuser2/files
sudo chmod 750 /var/sftp/sftpuser1/files
sudo chmod 750 /var/sftp/sftpuser2/files
```

### รูปแบบที่ 2: Shared Directory ร่วมกัน

```bash
# สร้าง shared directory ที่ทุก user ในกลุ่มเข้าถึงได้
sudo mkdir -p /var/sftp/shared
sudo chown root:sftpusers /var/sftp/shared
sudo chmod 770 /var/sftp/shared
```

:::warning 
ข้อกำหนดของ Chroot Jail
ChrootDirectory และ directory ทุกระดับเหนือขึ้นไปจนถึง `/` **ต้องเป็นเจ้าของโดย root** และ **ต้องไม่มี write permission สำหรับ group หรือ other** มิฉะนั้น SFTP จะปฏิเสธการเชื่อมต่อด้วย error `bad permissions`
:::

### โครงสร้าง Directory ที่ถูกต้อง

```
/var/sftp/                        (root:root, 755)
├── sftpuser1/                    (root:root, 755) ← ChrootDirectory
│   └── files/                   (sftpuser1:sftpusers, 750)
└── sftpuser2/                    (root:root, 755) ← ChrootDirectory
    └── files/                   (sftpuser2:sftpusers, 750)
```

---

## ขั้นตอนที่ 4: ตั้งค่า sshd_config

สำรอง config เดิมก่อนเสมอ:

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d)
```

เปิดแก้ไข:

```bash
sudo nano /etc/ssh/sshd_config
```

### ค้นหาและแก้ไขบรรทัด Subsystem

```bash
# ค้นหาบรรทัดนี้และแก้ไข (หรือ comment out อันเดิม)
# เปลี่ยนจาก:
Subsystem sftp /usr/lib/openssh/sftp-server

# เป็น:
Subsystem sftp internal-sftp
```

:::note 
ทำไมต้องใช้ `internal-sftp`
`internal-sftp` รันอยู่ภายใน SSH process เดิม ทำให้สามารถใช้งานร่วมกับ `ChrootDirectory` ได้อย่างสมบูรณ์ ต่างจาก `sftp-server` แบบเดิมที่เป็น process แยก
:::

### เพิ่ม Match Block ท้ายไฟล์

```bash title="/etc/ssh/sshd_config"
# ==========================================
# SFTP Configuration
# ==========================================
Match Group sftpusers
    # บังคับให้ใช้ SFTP เท่านั้น ห้าม SSH shell
    ForceCommand internal-sftp

    # จำกัดไม่ให้ออกนอก directory ที่กำหนด
    ChrootDirectory /var/sftp/%u

    # ปิด Tunneling ทั้งหมด
    PermitTunnel no
    AllowAgentForwarding no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no

    # Authentication (ปิด password ถ้าใช้ SSH Key อย่างเดียว)
    PasswordAuthentication no
    PubkeyAuthentication yes
```

### ตรวจสอบ syntax และ reload

```bash
# ตรวจสอบ syntax
sudo sshd -t

# ถ้าไม่มี error ให้ reload
sudo systemctl reload ssh
```

---

## ขั้นตอนที่ 5: SSH Key ส่วนกลาง สำหรับ SFTP User หลายคน

นี่คือส่วนที่สำคัญที่สุดสำหรับระบบที่มี SFTP user หลายคน

### ปัญหาของวิธีเดิม

ตามปกติ SSH จะมองหา authorized_keys ที่ `~/.ssh/authorized_keys` ของแต่ละ user แต่เมื่อใช้ Chroot Jail มีข้อจำกัดสำคัญ:

```
❌ ปัญหา: Chroot Jail ทำให้ path เปลี่ยนไป
   - ChrootDirectory = /var/sftp/sftpuser1
   - SSH จะมองหา authorized_keys ที่:
     /var/sftp/sftpuser1/home/sftpuser1/.ssh/authorized_keys
   - ต้องสร้างโครงสร้างนี้ทุก user = ยุ่งยากมาก

❌ ปัญหา: การเพิ่ม admin คนใหม่
   - ต้องไปแก้ไข authorized_keys ของทุก user
   - ถ้ามี 20 users ต้องแก้ไข 20 ไฟล์
```

### วิธีแก้: AuthorizedKeysFile ส่วนกลางนอก Chroot

เนื่องจาก SSH daemon อ่าน `AuthorizedKeysFile` **ก่อน** ที่จะทำ chroot จึงสามารถชี้ไปยังไฟล์นอก jail ได้

#### ขั้นตอนที่ 5.1: สร้างโครงสร้าง Global Key

```bash
# สร้าง directory สำหรับ SSH Key ส่วนกลาง
sudo mkdir -p /etc/ssh/sftp_keys

# สร้างไฟล์ key สำหรับ group sftpusers
sudo touch /etc/ssh/sftp_keys/global

# กำหนด permission
sudo chmod 644 /etc/ssh/sftp_keys/global
sudo chown root:root /etc/ssh/sftp_keys/global
```

#### ขั้นตอนที่ 5.2: เพิ่ม Public Key เข้าไฟล์ส่วนกลาง

```bash
# เพิ่ม key (แต่ละบรรทัดคือ 1 key)
sudo nano /etc/ssh/sftp_keys/global
```

ตัวอย่างไฟล์:
```text title="/etc/ssh/sftp_keys/global"
# Admin: John
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... john@company.com

# Admin: Sarah
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... sarah@company.com

# CI/CD System
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... deploy@ci-server
```

หรือเพิ่มผ่าน command line:
```bash
# เพิ่ม Public Key จากเครื่อง admin
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... admin@company" | sudo tee -a /etc/ssh/sftp_keys/global
```

#### ขั้นตอนที่ 5.3: แก้ไข sshd_config ให้ใช้ Global Key

เพิ่ม `AuthorizedKeysFile` ใน Match Block:

```bash title="/etc/ssh/sshd_config"
Match Group sftpusers
    ForceCommand internal-sftp
    ChrootDirectory /var/sftp/%u
    PermitTunnel no
    AllowAgentForwarding no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    PasswordAuthentication no
    PubkeyAuthentication yes

    # ✅ ชี้ไปยัง Global Key นอก Chroot Jail
    AuthorizedKeysFile /etc/ssh/sftp_keys/global
```

:::tip 
`%u` ใน AuthorizedKeysFile
ถ้าต้องการให้แต่ละ user มี key เฉพาะตัวด้วย สามารถใช้:
```
AuthorizedKeysFile /etc/ssh/sftp_keys/global /etc/ssh/sftp_keys/%u
```
SSH จะตรวจสอบทั้งสองตำแหน่ง โดย `%u` จะถูกแทนด้วยชื่อ user
:::

#### ขั้นตอนที่ 5.4: Reload และทดสอบ

```bash
sudo sshd -t
sudo systemctl reload ssh
```

### แผนภาพการทำงาน Global Key

```
เมื่อ sftpuser1 พยายามเชื่อมต่อ:

1. SSH daemon รับ connection
2. อ่าน /etc/ssh/sftp_keys/global  ← (ก่อน chroot)
3. ตรวจสอบ Public Key ที่ส่งมา
4. ✅ Key ตรงกัน → เชื่อมต่อสำเร็จ
5. chroot ไปยัง /var/sftp/sftpuser1
6. เริ่ม SFTP session (internal-sftp)
```

### วิธีที่ 2: แยก Global Key ตาม Group (สำหรับหลายทีม)

```bash
# สร้าง key แยกตาม team
sudo touch /etc/ssh/sftp_keys/admins
sudo touch /etc/ssh/sftp_keys/developers
sudo chmod 644 /etc/ssh/sftp_keys/admins /etc/ssh/sftp_keys/developers
```

```bash title="/etc/ssh/sshd_config"
# Admin group: เข้าถึงทุก directory
Match Group sftp-admins
    ForceCommand internal-sftp
    ChrootDirectory /var/sftp/%u
    PermitTunnel no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    PasswordAuthentication no
    AuthorizedKeysFile /etc/ssh/sftp_keys/admins

# Developer group: เข้าถึงเฉพาะ directory ของตัวเอง
Match Group sftp-developers
    ForceCommand internal-sftp
    ChrootDirectory /var/sftp/%u
    PermitTunnel no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    PasswordAuthentication no
    AuthorizedKeysFile /etc/ssh/sftp_keys/developers
```

เพิ่ม user เข้า group:
```bash
sudo usermod -aG sftp-admins sftpuser1
sudo usermod -aG sftp-developers sftpuser2
```

### การจัดการ Key ส่วนกลาง

```bash
# ดู key ทั้งหมดที่มี
sudo cat /etc/ssh/sftp_keys/global

# เพิ่ม key ใหม่
echo "ssh-ed25519 AAAA... newadmin@company" | sudo tee -a /etc/ssh/sftp_keys/global

# ลบ key ที่ไม่ต้องการ (แก้ไขไฟล์โดยตรง)
sudo nano /etc/ssh/sftp_keys/global

# ตรวจสอบจำนวน key
grep -c "ssh-" /etc/ssh/sftp_keys/global
```

---

## ขั้นตอนที่ 6: ตรวจสอบการตั้งค่า Permission

ปัญหาส่วนใหญ่ของ SFTP Chroot มาจาก permission ไม่ถูกต้อง

```bash
# Script ตรวจสอบ permission อัตโนมัติ
check_sftp_permissions() {
    local user=$1
    local chroot_dir="/var/sftp/$user"

    echo "=== ตรวจสอบ $user ==="
    echo "Chroot directory:"
    ls -ld "$chroot_dir"

    echo "Files directory:"
    ls -ld "$chroot_dir/files" 2>/dev/null || echo "ไม่พบ files directory"

    echo "Global key file:"
    ls -l /etc/ssh/sftp_keys/global

    echo ""
}

check_sftp_permissions sftpuser1
check_sftp_permissions sftpuser2
```

Permission ที่ต้องตรงตามนี้:

```
/var/sftp/               drwxr-xr-x  root:root
/var/sftp/sftpuser1/     drwxr-xr-x  root:root      ← ChrootDir
/var/sftp/sftpuser1/files/ drwxr-x---  sftpuser1:sftpusers
/etc/ssh/sftp_keys/global  -rw-r--r--  root:root
```

---

## ขั้นตอนที่ 7: ทดสอบการเชื่อมต่อ SFTP

### ทดสอบด้วย Command Line

```bash
# เชื่อมต่อด้วย SSH Key
sftp -i ~/.ssh/id_ed25519 sftpuser1@server_ip

# เชื่อมต่อผ่าน port อื่น
sftp -i ~/.ssh/id_ed25519 -P 2222 sftpuser1@server_ip

# ถ้าตั้งค่า SSH Client Config ไว้
sftp sftpuser1@myserver
```

### คำสั่ง SFTP ที่ใช้บ่อย

```bash
# เมื่ออยู่ใน SFTP session แล้ว

# ดูไฟล์บนเซิร์ฟเวอร์
ls
ls -la

# ดู directory ปัจจุบัน (remote)
pwd

# เปลี่ยน directory
cd files

# ดู directory ปัจจุบัน (local)
lpwd

# เปลี่ยน directory บนเครื่องตัวเอง
lcd /home/user/downloads

# Upload ไฟล์
put localfile.txt
put localfile.txt remotefile.txt   # เปลี่ยนชื่อด้วย

# Upload หลายไฟล์
put *.txt
mput *.csv

# Download ไฟล์
get remotefile.txt
get remotefile.txt localfile.txt   # เปลี่ยนชื่อด้วย

# Download หลายไฟล์
mget *.log

# สร้าง directory
mkdir newfolder

# ลบไฟล์
rm oldfile.txt

# ออกจาก SFTP
exit
bye
```

### ทดสอบ verbose (debug)

```bash
# แสดง debug log ระหว่างเชื่อมต่อ
sftp -v -i ~/.ssh/id_ed25519 sftpuser1@server_ip

# ดู log บนเซิร์ฟเวอร์
sudo journalctl -u ssh -f
sudo tail -f /var/log/auth.log
```

---

## การตั้งค่า SFTP Client

### Command Line (Linux / macOS / Windows PowerShell)

ตั้งค่า `~/.ssh/config` เพื่อสร้างทางลัด:

```text title="~/.ssh/config"
Host sftp-prod
    HostName 203.0.113.10
    User sftpuser1
    Port 22
    IdentityFile ~/.ssh/id_ed25519_sftp
    IdentitiesOnly yes
```

ใช้งาน:
```bash
sftp sftp-prod
```

### WinSCP (Windows GUI)

WinSCP เป็น SFTP client ยอดนิยมสำหรับ Windows ที่รองรับ SSH Key

1. ดาวน์โหลดและติดตั้ง [WinSCP](https://winscp.net)
2. เปิด WinSCP → คลิก **New Site**
3. ตั้งค่า:
   - **File protocol**: `SFTP`
   - **Host name**: IP หรือ domain ของเซิร์ฟเวอร์
   - **Port number**: `22` (หรือ port ที่ตั้งไว้)
   - **User name**: ชื่อ SFTP user
4. คลิก **Advanced...** → **SSH** → **Authentication**
5. เลือกไฟล์ **Private key file** (รองรับ `.ppk` และ `.pem`)
6. ถ้าไฟล์ไม่ใช่ `.ppk` WinSCP จะขอแปลงให้อัตโนมัติ
7. คลิก **OK** → **Login**

:::note 
แปลง Private Key เป็น PPK
WinSCP ใช้รูปแบบ `.ppk` ของ PuTTY หากมี key เป็น format อื่น สามารถแปลงผ่าน WinSCP ได้อัตโนมัติเมื่อเลือกไฟล์ หรือใช้ PuTTYgen แปลงเองก็ได้
:::

### FileZilla (Windows / macOS / Linux GUI)

FileZilla รองรับ SFTP และใช้งานได้ทุกแพลตฟอร์ม

**เพิ่ม SSH Key:**
1. ไปที่ **Edit** → **Settings** → **Connection** → **SFTP**
2. คลิก **Add key file...** แล้วเลือก Private Key ของคุณ
3. คลิก **OK**

**สร้าง Connection:**
1. ไปที่ **File** → **Site Manager**
2. คลิก **New Site**
3. ตั้งค่า:
   - **Protocol**: `SFTP - SSH File Transfer Protocol`
   - **Host**: IP หรือ domain
   - **Port**: `22`
   - **Logon Type**: `Key file` (สำหรับ SSH Key) หรือ `Normal` (ถ้า key อยู่ใน SSH Agent)
   - **User**: ชื่อ SFTP user
4. คลิก **Connect**

### Cyberduck (macOS / Windows)

1. คลิก **Open Connection**
2. เลือก **SFTP (SSH File Transfer Protocol)**
3. กรอก Server, Port, Username
4. เลือก **SSH Private Key** จาก dropdown แล้วเลือกไฟล์ key
5. คลิก **Connect**

---

## การตั้งค่า Firewall

```bash
# อนุญาต SSH/SFTP port ผ่าน UFW
sudo ufw allow 22/tcp
# หรือถ้าเปลี่ยน port
sudo ufw allow 2222/tcp

# อนุญาตเฉพาะ IP ที่เชื่อถือได้
sudo ufw allow from 203.0.113.0/24 to any port 22

# ดูสถานะ
sudo ufw status verbose
```

---

## การแก้ปัญหาที่พบบ่อย

### ❌ Connection refused / Permission denied (publickey)

```bash
# ตรวจสอบ permission ของ chroot directory
ls -ld /var/sftp/sftpuser1
# ต้องเป็น: drwxr-xr-x root root

# ตรวจสอบ global key file
ls -l /etc/ssh/sftp_keys/global
# ต้องเป็น: -rw-r--r-- root root

# ดู error log
sudo journalctl -u ssh --since "5 minutes ago"
sudo tail -50 /var/log/auth.log
```

### ❌ bad ownership or modes for chroot directory

directory ที่ใช้เป็น chroot ถูกเจ้าของโดย user แทนที่จะเป็น root:

```bash
# แก้ไข: ให้ root เป็นเจ้าของ chroot directory
sudo chown root:root /var/sftp/sftpuser1
sudo chmod 755 /var/sftp/sftpuser1
```

### ❌ subsystem request failed on channel 0

Subsystem ไม่ได้ถูกตั้งค่าเป็น `internal-sftp`:

```bash
# ตรวจสอบบรรทัดนี้ใน sshd_config
grep "Subsystem" /etc/ssh/sshd_config
# ต้องแสดง: Subsystem sftp internal-sftp

sudo systemctl reload ssh
```

### ❌ Could not chdir to home directory

home directory ของ user ไม่ตรงกับ chroot:

```bash
# ตรวจสอบ home directory ของ user
grep sftpuser1 /etc/passwd
# ผลที่ได้: sftpuser1:x:1001:1001::/home/sftpuser1:/usr/sbin/nologin

# แก้ไข: ForceCommand internal-sftp จะ override home directory อยู่แล้ว
# ถ้ายังมีปัญหา เพิ่ม -d flag
ForceCommand internal-sftp -d /files
```

### ❌ User สามารถ login ด้วย SSH shell ได้อยู่

ตรวจสอบว่า `Match Group` block อยู่ท้ายสุดของ `sshd_config`:

```bash
# Match block ต้องเป็นส่วนสุดท้ายของไฟล์
tail -30 /etc/ssh/sshd_config
```

---

## การ Monitor และ Log

### ดู SFTP Connection แบบ Real-time

```bash
# ดู log แบบ live
sudo journalctl -u ssh -f

# Filter เฉพาะ SFTP
sudo journalctl -u ssh | grep "subsystem request for sftp"

# ดู login สำเร็จ
sudo grep "Accepted publickey" /var/log/auth.log

# ดูการ login ล้มเหลว
sudo grep "Failed" /var/log/auth.log
```

### ดูการ Transfer ไฟล์

เพิ่ม `-l` flag ให้ internal-sftp เพื่อ enable logging:

```bash title="/etc/ssh/sshd_config"
Match Group sftpusers
    ForceCommand internal-sftp -l INFO
    # ...
```

```bash
# ดู log การ transfer
sudo journalctl -u ssh | grep "sftp"
```

---

## การจำกัด Bandwidth (Rate Limiting)

OpenSSH ไม่มี option สำหรับจำกัด bandwidth โดยตรงใน `sshd_config` แต่สามารถทำได้ผ่านเครื่องมือระดับ OS ซึ่งมีหลายวิธีตามความซับซ้อนและความต้องการ

### เปรียบเทียบแต่ละวิธี

| วิธี | ระดับ | จำกัดต่อ User | ง่าย/ยาก | เหมาะกับ |
|---|---|---|---|---|
| `trickle` | Process | ✅ | ง่าย | Dev/Test, per-command |
| `wondershaper` | Interface | ❌ (ทั้ง interface) | ง่าย | จำกัด bandwidth ทั้งเซิร์ฟเวอร์ |
| `tc` (Traffic Control) | Kernel | ✅ (ขั้นสูง) | ยาก | Production, ละเอียด |

---

### วิธีที่ 1: trickle — จำกัดต่อ User (แนะนำ)

`trickle` ทำงานที่ระดับ userspace โดย intercept socket calls ของ process ไม่ต้องการ root

#### ติดตั้ง

```bash
sudo apt install trickle -y
```

#### ใช้งานพื้นฐาน

```bash
# จำกัด download 500 KB/s, upload 200 KB/s สำหรับคำสั่ง sftp
trickle -d 500 -u 200 sftp user@server

# จำกัดเฉพาะ upload
trickle -u 100 sftp user@server

# หน่วยเป็น KB/s เสมอ
# 1024 KB/s = ~1 MB/s
```

#### ใช้ใน ForceCommand (จำกัด bandwidth ฝั่งเซิร์ฟเวอร์ต่อ User)

วิธีนี้บังคับให้ทุก SFTP session ของ user ถูกจำกัด bandwidth โดยอัตโนมัติ ไม่ต้องให้ client ตั้งค่าเอง

```bash title="/etc/ssh/sshd_config"
Match Group sftpusers
    # ใช้ trickle ครอบ internal-sftp
    # -d = download limit (KB/s), -u = upload limit (KB/s)
    ForceCommand trickle -d 1024 -u 512 internal-sftp
    ChrootDirectory /var/sftp/%u
    PermitTunnel no
    AllowAgentForwarding no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    PasswordAuthentication no
    AuthorizedKeysFile /etc/ssh/sftp_keys/global
```

:::warning 
trickle ต้องอยู่นอก Chroot
`trickle` จะต้องถูกเรียกใช้ **ก่อน** chroot เท่านั้น ซึ่ง `ForceCommand` ทำงานก่อน chroot พอดี จึงใช้วิธีนี้ได้
:::

#### กำหนด Limit ต่างกันแต่ละ User ด้วย Match User

```bash title="/etc/ssh/sshd_config"
# User ทั่วไป: จำกัด 512 KB/s
Match User sftpuser1
    ForceCommand trickle -d 512 -u 512 internal-sftp
    ChrootDirectory /var/sftp/%u
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    AuthorizedKeysFile /etc/ssh/sftp_keys/global

# User VIP: ได้ bandwidth มากกว่า
Match User sftpuser2
    ForceCommand trickle -d 2048 -u 2048 internal-sftp
    ChrootDirectory /var/sftp/%u
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    AuthorizedKeysFile /etc/ssh/sftp_keys/global
```

---

### วิธีที่ 2: wondershaper — จำกัดทั้ง Interface

`wondershaper` จำกัด bandwidth ของ network interface ทั้งหมด เหมาะสำหรับเซิร์ฟเวอร์ที่ต้องการจำกัด bandwidth รวมไม่ให้เกิน

#### ติดตั้ง

```bash
sudo apt install wondershaper -y
```

#### ค้นหาชื่อ Interface

```bash
ip link show
# หรือ
ip addr
# ตัวอย่างชื่อ: eth0, ens3, enp0s3
```

#### ใช้งาน

```bash
# จำกัด download 10 Mbps, upload 5 Mbps บน interface eth0
# หน่วยเป็น Kbps (1 Mbps = 1000 Kbps)
sudo wondershaper -a eth0 -d 10000 -u 5000

# ดูสถานะ
sudo wondershaper -s -a eth0

# ยกเลิก limit
sudo wondershaper -c -a eth0
```

#### ตั้งค่าให้ทำงานถาวรทุกครั้งที่ boot

```bash
# แก้ไขไฟล์ config
sudo nano /etc/conf.d/wondershaper.conf
```

```ini title="/etc/conf.d/wondershaper.conf"
[wondershaper]
# ชื่อ network interface
iface=eth0

# Download limit (Kbps)
dspeed=10000

# Upload limit (Kbps)
uspeed=5000
```

```bash
# เปิดใช้งาน service
sudo systemctl enable wondershaper
sudo systemctl start wondershaper
```

---

### วิธีที่ 3: tc (Traffic Control) — ละเอียด ระดับ Production

`tc` เป็น built-in Linux kernel tool ที่ทรงพลังที่สุด สามารถกำหนด rule ได้ละเอียดมาก แต่ syntax ซับซ้อนกว่า

#### จำกัด Bandwidth ทั้ง Interface (แบบง่าย TBF)

```bash
# ดูชื่อ interface
ip link show

# จำกัด bandwidth รวมทั้ง interface ไม่เกิน 10 Mbps
sudo tc qdisc add dev eth0 root tbf rate 10mbit burst 32kbit latency 400ms

# ดูสถานะ
sudo tc qdisc show dev eth0

# ยกเลิก
sudo tc qdisc del dev eth0 root
```

#### ตั้งค่าให้ทำงานถาวรด้วย systemd

```bash
# สร้าง script
sudo nano /usr/local/bin/sftp-bandwidth-limit.sh
```

```bash title="/usr/local/bin/sftp-bandwidth-limit.sh"
#!/bin/bash
IFACE="eth0"
LIMIT="10mbit"

# ลบ rule เดิม (ถ้ามี)
tc qdisc del dev $IFACE root 2>/dev/null

# กำหนด limit ใหม่
tc qdisc add dev $IFACE root tbf rate $LIMIT burst 32kbit latency 400ms

echo "Bandwidth limited to $LIMIT on $IFACE"
```

```bash
sudo chmod +x /usr/local/bin/sftp-bandwidth-limit.sh
```

```bash
# สร้าง systemd service
sudo nano /etc/systemd/system/sftp-bwlimit.service
```

```ini title="/etc/systemd/system/sftp-bwlimit.service"
[Unit]
Description=SFTP Bandwidth Limiting
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/sftp-bandwidth-limit.sh
ExecStop=/sbin/tc qdisc del dev eth0 root

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable sftp-bwlimit
sudo systemctl start sftp-bwlimit
```

---

### สรุปการเลือกใช้แต่ละวิธี

```
ต้องการจำกัด bandwidth ต่อ user แต่ละคน?
├── ใช่ → trickle ใน ForceCommand (ง่าย, ไม่ต้อง root)
└── ไม่ → ต้องการจำกัด bandwidth รวมทั้งเซิร์ฟเวอร์?
         ├── ใช่ (ง่าย) → wondershaper
         └── ใช่ (ละเอียด) → tc (Traffic Control)
```

:::tip 
แนะนำสำหรับ SFTP Server
ในกรณีส่วนใหญ่ **trickle ใน ForceCommand** เป็นวิธีที่เหมาะสมที่สุด เพราะ:
- กำหนด limit ต่อ user/group ได้อย่างอิสระ
- ไม่กระทบ traffic อื่นบนเซิร์ฟเวอร์ (เช่น web server, SSH shell)
- ตั้งค่าง่าย แก้ไขได้ใน `sshd_config` ที่เดียว
:::

---

## สรุปไฟล์ที่แก้ไขและสร้างใหม่

| ไฟล์/Directory | หน้าที่ |
|---|---|
| `/etc/ssh/sshd_config` | config หลักของ SSH/SFTP |
| `/etc/ssh/sftp_keys/global` | SSH Key ส่วนกลางสำหรับ SFTP |
| `/var/sftp/<user>/` | Chroot directory แต่ละ user |
| `/var/sftp/<user>/files/` | Directory ที่ user upload/download ได้ |

## Permission Reference

```bash
# ตรวจสอบ permission ทั้งหมดด้วยคำสั่งเดียว
stat /var/sftp /var/sftp/sftpuser1 /var/sftp/sftpuser1/files \
     /etc/ssh/sftp_keys /etc/ssh/sftp_keys/global
```

| Path | Owner | Permission |
|---|---|---|
| `/var/sftp/` | `root:root` | `755` |
| `/var/sftp/<user>/` | `root:root` | `755` |
| `/var/sftp/<user>/files/` | `<user>:sftpusers` | `750` |
| `/etc/ssh/sftp_keys/` | `root:root` | `755` |
| `/etc/ssh/sftp_keys/global` | `root:root` | `644` |