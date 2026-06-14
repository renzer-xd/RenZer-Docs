---
sidebar_position: 9
id: linux-user-group-management
title: การจัดการผู้ใช้งานและกลุ่มระบบ (User & Group Management) ใน Linux (Ubuntu)
sidebar_label: 8. จัดการ User & Group
description: คู่มือการจัดการ User และ Group ใน Linux Ubuntu อย่างละเอียด ครอบคลุมการสร้าง ตรวจสอบ แก้ไข และลบ User และ Group
---

# การจัดการผู้ใช้งานและกลุ่มระบบ (User & Group Management) ใน Linux (Ubuntu)

Linux เป็นระบบปฏิบัติการแบบ multi-user ที่รองรับผู้ใช้หลายคนพร้อมกัน การจัดการ User และ Group อย่างถูกต้องจึงเป็นพื้นฐานสำคัญของการดูแลความปลอดภัยและการควบคุมสิทธิ์การเข้าถึงระบบ

---

## 1. ทำความเข้าใจระบบ User และ Group

### ประเภทของ User

| ประเภท | UID | ตัวอย่าง | หน้าที่ |
|---|---|---|---|
| **root** | 0 | `root` | superuser มีสิทธิ์สูงสุดในระบบ |
| **System User** | 1–999 | `www-data`, `mysql` | ใช้รัน service ไม่มี home directory |
| **Regular User** | 1000+ | `alice`, `bob` | ผู้ใช้งานทั่วไป มี home directory |

---

### ไฟล์สำคัญที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `/etc/passwd` | เก็บข้อมูล user ทั้งหมด |
| `/etc/shadow` | เก็บ password แบบ encrypted |
| `/etc/group` | เก็บข้อมูล group ทั้งหมด |
| `/etc/gshadow` | เก็บ group password แบบ encrypted |
| `/etc/skel/` | template สำหรับ home directory ของ user ใหม่ |
| `/home/` | ที่เก็บ home directory ของ user |

---

### โครงสร้างของไฟล์ `/etc/passwd`

```
username:x:UID:GID:comment:home_directory:shell
alice:x:1001:1001:Alice Smith:/home/alice:/bin/bash
```

| ฟิลด์ | ความหมาย |
|---|---|
| `alice` | ชื่อ user |
| `x` | password (เก็บใน `/etc/shadow`) |
| `1001` | User ID (UID) |
| `1001` | Group ID หลัก (GID) |
| `Alice Smith` | ชื่อเต็ม (GECOS) |
| `/home/alice` | home directory |
| `/bin/bash` | shell ที่ใช้ |

---

### โครงสร้างของไฟล์ `/etc/group`

```
groupname:x:GID:member1,member2
developers:x:1002:alice,bob,charlie
```

---

## 2. การตรวจสอบ User (Check User)

### ตรวจสอบ User ปัจจุบัน

```bash
# ดู user ที่ login อยู่ตอนนี้
whoami

# ดูข้อมูล user ปัจจุบัน (UID, GID, groups)
id

# ดูข้อมูล user ที่ระบุ
id alice

# ดู user ที่ login อยู่ทั้งหมดในระบบ
who

# ดูแบบละเอียดรวม IP และเวลา login
w

# ดูประวัติการ login
last

# ดูการ login ล่าสุดของแต่ละ user
lastlog

# ดูการ login ล่าสุดของ user ที่ระบุ
lastlog -u alice
```

**ตัวอย่างผลลัพธ์ `id alice`:**
```
uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo),1002(developers)
```

---

### ตรวจสอบรายการ User ในระบบ

```bash
# ดูรายการ user ทั้งหมด
cat /etc/passwd

# ดูเฉพาะชื่อ user ทั้งหมด
cut -d: -f1 /etc/passwd

# ดูเฉพาะ Regular User (UID >= 1000) ไม่รวม nobody
awk -F: '$3 >= 1000 && $3 != 65534 {print $1, $3, $6}' /etc/passwd

# ดู user ที่มี shell ใช้งานได้ (ไม่ใช่ nologin)
grep -v "nologin\|false" /etc/passwd | cut -d: -f1

# ดูจำนวน user ทั้งหมด
wc -l /etc/passwd

# ค้นหา user ที่ระบุ
grep "^alice" /etc/passwd

# ดูข้อมูล user แบบอ่านง่าย
getent passwd alice
getent passwd    # ดูทั้งหมด
```

---

### ตรวจสอบ Group ของ User

```bash
# ดู group ทั้งหมดที่ user ปัจจุบันสังกัด
groups

# ดู group ของ user ที่ระบุ
groups alice

# ดูรายการ group ทั้งหมดในระบบ
cat /etc/group

# ดูเฉพาะชื่อ group ทั้งหมด
cut -d: -f1 /etc/group

# ค้นหา group ที่ระบุ
grep "^developers" /etc/group
getent group developers

# ดูสมาชิกทั้งหมดใน group
getent group developers
# developers:x:1002:alice,bob,charlie
```

---

### ตรวจสอบสถานะ Password

```bash
# ดูสถานะ password ของ user
sudo passwd -S alice

# ดูสถานะ password ของทุก user
sudo passwd -Sa

# ดูข้อมูล password แบบละเอียด (อายุ, expiry)
sudo chage -l alice
```

**ตัวอย่างผลลัพธ์ `passwd -S alice`:**
```
alice P 01/10/2024 0 99999 7 -1
```

| คอลัมน์ | ความหมาย |
|---|---|
| `alice` | ชื่อ user |
| `P` | Password ถูก set แล้ว (L=Locked, NP=No Password) |
| `01/10/2024` | วันที่เปลี่ยน password ล่าสุด |
| `0` | อายุขั้นต่ำก่อนเปลี่ยน password (วัน) |
| `99999` | อายุสูงสุดของ password (วัน) |
| `7` | แจ้งเตือนก่อน password หมดอายุ (วัน) |
| `-1` | ปิดบัญชีหลัง password หมดอายุ (วัน) |

---

### ตรวจสอบ User ที่ Login อยู่แบบ Real-time

```bash
# ดู user ที่ login อยู่ทั้งหมด
who
w

# ดูจำนวน user ที่ login อยู่
who | wc -l

# ดูประวัติการ login/logout
last | head -20

# ดูการ login ที่ล้มเหลว
sudo lastb | head -20

# ดู log การ authentication
sudo tail -f /var/log/auth.log
sudo grep "Failed password" /var/log/auth.log
```

---

## 3. การสร้าง User

### `adduser` — สร้าง User แบบ Interactive (แนะนำ)

```bash
# สร้าง user ใหม่แบบ interactive (ถามข้อมูลทีละขั้น)
sudo adduser alice
```

**ขั้นตอนที่ระบบถาม:**
```
Adding user 'alice' ...
Adding new group 'alice' (1001) ...
Adding new user 'alice' (1001) with group 'alice' ...
Creating home directory '/home/alice' ...
Copying files from '/etc/skel' ...
New password: ****
Retype new password: ****
passwd: password updated successfully
Full Name []: Alice Smith
Room Number []: 
Work Phone []: 
Home Phone []: 
Other []: 
Is the information correct? [Y/n] Y
```

---

### `useradd` — สร้าง User แบบกำหนดเอง

```bash
# สร้าง user พร้อม home directory และ shell
sudo useradd -m -s /bin/bash alice

# สร้าง user พร้อมกำหนดทุกอย่าง
sudo useradd \
  -m \                          # สร้าง home directory
  -d /home/alice \              # กำหนด path ของ home
  -s /bin/bash \                # กำหนด shell
  -c "Alice Smith" \            # ชื่อเต็ม (comment)
  -u 1500 \                     # กำหนด UID เอง
  -g developers \               # กำหนด primary group
  -G sudo,docker \              # กำหนด secondary groups
  alice

# ตั้ง password หลังสร้าง user
sudo passwd alice

# สร้าง System User (ไม่มี home, ใช้รัน service)
sudo useradd -r -s /usr/sbin/nologin myservice
```

**ตัวเลือกของ `useradd`:**

| Option | ความหมาย |
|---|---|
| `-m` | สร้าง home directory |
| `-d /path` | กำหนด path ของ home directory |
| `-s /bin/bash` | กำหนด shell |
| `-c "ชื่อ"` | กำหนดชื่อเต็ม (comment) |
| `-u UID` | กำหนด UID เอง |
| `-g group` | กำหนด primary group |
| `-G g1,g2` | กำหนด secondary groups |
| `-e YYYY-MM-DD` | กำหนดวันหมดอายุบัญชี |
| `-r` | สร้างเป็น system user |
| `-M` | ไม่สร้าง home directory |

---

### กำหนด Password Policy

```bash
# กำหนดให้ user ต้องเปลี่ยน password ตอน login ครั้งแรก
sudo chage -d 0 alice

# กำหนดอายุ password สูงสุด 90 วัน
sudo chage -M 90 alice

# กำหนดอายุ password ขั้นต่ำ 7 วัน (เปลี่ยนได้อีกทีหลังจาก 7 วัน)
sudo chage -m 7 alice

# แจ้งเตือนก่อน password หมดอายุ 14 วัน
sudo chage -W 14 alice

# กำหนดวันหมดอายุบัญชี
sudo chage -E 2025-12-31 alice

# ดูการตั้งค่าทั้งหมด
sudo chage -l alice
```

---

## 4. การแก้ไข User

### `usermod` — แก้ไขข้อมูล User

```bash
# เปลี่ยนชื่อ user
sudo usermod -l new_username old_username

# เปลี่ยน home directory (และย้ายไฟล์ด้วย -m)
sudo usermod -d /new/home/alice -m alice

# เปลี่ยน shell
sudo usermod -s /bin/zsh alice

# เปลี่ยนชื่อเต็ม (comment)
sudo usermod -c "Alice Johnson" alice

# เปลี่ยน UID
sudo usermod -u 1500 alice

# เพิ่ม user เข้า group (ไม่ลบ group เดิม ต้องใช้ -aG)
sudo usermod -aG developers alice
sudo usermod -aG sudo,docker,www-data alice

# เปลี่ยน primary group
sudo usermod -g developers alice

# กำหนดวันหมดอายุบัญชี
sudo usermod -e 2025-12-31 alice

# ล็อกบัญชี user (ไม่ให้ login)
sudo usermod -L alice

# ปลดล็อกบัญชี user
sudo usermod -U alice
```

---

### เปลี่ยน Password

```bash
# เปลี่ยน password ของตัวเอง
passwd

# เปลี่ยน password ของ user อื่น (ต้องเป็น root)
sudo passwd alice

# ล็อก password (ไม่ให้ login ด้วย password)
sudo passwd -l alice

# ปลดล็อก password
sudo passwd -u alice

# ลบ password (ไม่ต้องใส่ password ตอน login)
sudo passwd -d alice

# บังคับให้เปลี่ยน password ครั้งถัดไปที่ login
sudo passwd -e alice
```

---

## 5. การลบ User

### `deluser` — ลบ User (แนะนำสำหรับ Ubuntu)

```bash
# ลบ user (เก็บ home directory และไฟล์ไว้)
sudo deluser alice

# ลบ user พร้อมลบ home directory
sudo deluser --remove-home alice

# ลบ user พร้อมลบไฟล์ทั้งหมดที่ user เป็นเจ้าของในระบบ
sudo deluser --remove-all-files alice

# ลบ user ออกจาก group
sudo deluser alice developers
```

---

### `userdel` — ลบ User แบบ Manual

```bash
# ลบ user (เก็บ home directory ไว้)
sudo userdel alice

# ลบ user พร้อมลบ home directory
sudo userdel -r alice

# ลบ user พร้อมลบ mail spool
sudo userdel -r -f alice
```

:::warning 
ข้อควรระวังก่อนลบ User ควรตรวจสอบก่อนลบ user เพื่อไม่ให้ข้อมูลสูญหายหรือระบบเกิดปัญหา
:::

---

### ขั้นตอนที่แนะนำก่อนลบ User

```bash
# 1. ตรวจสอบว่า user login อยู่หรือไม่
who | grep alice
w | grep alice

# 2. ดู process ที่ user กำลังรันอยู่
ps aux | grep "^alice"

# 3. หยุด process ทั้งหมดของ user
sudo pkill -u alice

# 4. ตรวจสอบ cron job ของ user
sudo crontab -u alice -l

# 5. สำรองข้อมูล home directory ก่อนลบ
sudo tar -czvf /backup/alice_home_$(date +%Y%m%d).tar.gz /home/alice/

# 6. ตรวจสอบไฟล์ที่ user เป็นเจ้าของทั่วระบบ
sudo find / -user alice 2>/dev/null

# 7. ลบ user พร้อม home directory
sudo deluser --remove-home alice

# 8. ตรวจสอบว่าลบแล้ว
id alice    # ควรได้รับ error: no such user
getent passwd alice    # ควรไม่แสดงผล
```

---

### ลบ User แบบ Backup ก่อน

```bash
# สร้างโฟลเดอร์สำรองข้อมูล
sudo mkdir -p /backup/users

# สำรองข้อมูลทั้งหมดของ user
sudo tar -czvf /backup/users/alice_$(date +%Y%m%d_%H%M%S).tar.gz \
  /home/alice/ \
  /var/spool/cron/crontabs/alice 2>/dev/null

# ลบ user
sudo deluser --remove-home alice

# ยืนยันการลบ
echo "ตรวจสอบ user:"
id alice 2>&1
echo "ตรวจสอบ home directory:"
ls /home/alice 2>&1
```

---

## 6. การจัดการ Group

### สร้าง Group

```bash
# สร้าง group ใหม่
sudo addgroup developers
sudo groupadd developers

# สร้าง group พร้อมกำหนด GID
sudo groupadd -g 2000 developers

# สร้าง System group
sudo groupadd -r myservice
```

---

### แก้ไข Group

```bash
# เปลี่ยนชื่อ group
sudo groupmod -n new_group_name old_group_name

# เปลี่ยน GID
sudo groupmod -g 2001 developers

# เพิ่ม user เข้า group
sudo adduser alice developers
sudo usermod -aG developers alice
sudo gpasswd -a alice developers

# ลบ user ออกจาก group
sudo deluser alice developers
sudo gpasswd -d alice developers

# กำหนด admin ของ group
sudo gpasswd -A alice developers

# ดู group admin และสมาชิก
sudo gpasswd -I developers
```

---

### ตรวจสอบ Group

```bash
# ดูรายการ group ทั้งหมด
getent group

# ดูข้อมูล group ที่ระบุ
getent group developers

# ดูสมาชิกของ group
getent group developers | cut -d: -f4

# ดู group ทั้งหมดที่ user สังกัด
groups alice
id alice

# ค้นหา user ที่อยู่ใน group
grep "developers" /etc/group

# ดูจำนวนสมาชิกใน group
getent group developers | tr ',' '\n' | grep -v "^developers" | wc -l
```

---

### ลบ Group

```bash
# ลบ group (ต้องไม่มี user ที่ใช้เป็น primary group)
sudo delgroup developers
sudo groupdel developers

# ตรวจสอบก่อนลบ — ดู user ที่ใช้ group นี้เป็น primary group
awk -F: '$4 == "1002" {print $1}' /etc/passwd    # แทน 1002 ด้วย GID ของ group

# ตรวจสอบว่าลบแล้ว
getent group developers    # ควรไม่แสดงผล
```

:::warning 
ไม่สามารถลบ group ที่มี user ใช้เป็น primary group ได้ ต้องเปลี่ยน primary group ของ user เหล่านั้นก่อน
:::

---

## 7. การล็อกและปลดล็อก User

```bash
# ล็อกบัญชี user (ไม่ให้ login)
sudo usermod -L alice
sudo passwd -l alice

# ตรวจสอบสถานะ (จะมี ! นำหน้า password hash)
sudo passwd -S alice
sudo grep "^alice" /etc/shadow

# ปลดล็อกบัญชี user
sudo usermod -U alice
sudo passwd -u alice

# ปิดบัญชีโดยกำหนดวันหมดอายุเป็นวันที่ผ่านมา
sudo usermod -e 1970-01-01 alice

# เปิดบัญชีโดยลบวันหมดอายุ
sudo usermod -e "" alice

# ปิดการ login ด้วยการเปลี่ยน shell เป็น nologin
sudo usermod -s /usr/sbin/nologin alice

# เปิดการ login กลับมา
sudo usermod -s /bin/bash alice
```

---

## 8. การสลับ User (Switch User)

```bash
# สลับไปเป็น user อื่น
su alice

# สลับพร้อมโหลด environment ของ user นั้น
su - alice

# รันคำสั่งในฐานะ user อื่น
su -c "command" alice

# สลับเป็น root
su -
sudo -i
sudo su

# รันคำสั่งในฐานะ root โดยไม่สลับ shell
sudo command

# รันคำสั่งในฐานะ user อื่นด้วย sudo
sudo -u bob command
sudo -u www-data ls /var/www/

# ดูสิทธิ์ sudo ของตัวเอง
sudo -l
```

---

## 9. การตรวจสอบความปลอดภัยของ User

### ตรวจสอบ User ที่มีสิทธิ์ sudo

```bash
# ดู user ที่อยู่ใน group sudo
getent group sudo

# ดู user ที่มีสิทธิ์ sudo ทั้งหมด
sudo grep -r "ALL" /etc/sudoers /etc/sudoers.d/ 2>/dev/null

# ดูไฟล์ sudoers
sudo cat /etc/sudoers
sudo visudo -c    # ตรวจสอบ syntax ของ sudoers
```

---

### ตรวจสอบ User ที่น่าสงสัย

```bash
# ดู user ที่มี UID 0 (ควรมีแค่ root)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# ดู user ที่ไม่มี password (ช่องว่าง)
sudo awk -F: '$2 == "" {print $1}' /etc/shadow

# ดู user ที่ password ไม่ได้ถูก hash (!!)
sudo awk -F: '$2 == "!!" {print $1}' /etc/shadow

# ดู user ที่ใช้ shell ที่ login ได้
grep -v "nologin\|false\|sync\|halt\|shutdown" /etc/passwd | cut -d: -f1

# ดูประวัติการ login ที่ล้มเหลว
sudo lastb | head -20
sudo grep "Failed password" /var/log/auth.log | tail -20

# ดูการพยายาม sudo ที่ล้มเหลว
sudo grep "sudo.*FAILED\|sudo.*incorrect" /var/log/auth.log
```

---

### ตรวจสอบ Home Directory

```bash
# ดู home directory ของ user ทั้งหมด
ls -la /home/

# ตรวจสอบสิทธิ์ home directory (ควรเป็น 700 หรือ 755)
ls -ld /home/*/

# หา home directory ที่มีสิทธิ์ไม่ปลอดภัย
find /home -maxdepth 1 -type d -perm /o+w 2>/dev/null

# ตรวจสอบไฟล์ .ssh ของ user
ls -la /home/alice/.ssh/
```

---

## 10. การกำหนดสิทธิ์ sudo อย่างละเอียด

### การแก้ไขไฟล์ sudoers

:::danger
**ห้ามแก้ไขไฟล์ `/etc/sudoers` โดยตรง** ให้ใช้คำสั่ง `sudo visudo` เสมอ เพราะจะตรวจสอบ syntax ก่อนบันทึก หาก syntax ผิดพลาดอาจทำให้ sudo ใช้งานไม่ได้ทั้งระบบ
:::

```bash
# เปิดแก้ไขไฟล์ sudoers อย่างปลอดภัย
sudo visudo

# เปิดด้วย editor ที่ต้องการ
sudo EDITOR=nano visudo
sudo EDITOR=vim visudo
```

---

### กำหนดให้ User ใช้ sudo ได้โดยไม่ต้องพิมพ์รหัสผ่าน

#### วิธีที่ 1 — แก้ไขใน `/etc/sudoers` โดยตรง (ใช้ visudo)

```bash
sudo visudo
```

เพิ่มบรรทัดนี้ในไฟล์:

```bash
# กำหนดให้ user ที่ระบุใช้ sudo ได้ทุกคำสั่งโดยไม่ต้องพิมพ์รหัสผ่าน
alice ALL=(ALL) NOPASSWD: ALL

# กำหนดให้ทุกคนใน group sudo ใช้ได้โดยไม่ต้องพิมพ์รหัสผ่าน
%sudo ALL=(ALL) NOPASSWD: ALL

# กำหนดให้ทุกคนใน group developers ใช้ได้โดยไม่ต้องพิมพ์รหัสผ่าน
%developers ALL=(ALL) NOPASSWD: ALL
```

---

#### วิธีที่ 2 — สร้างไฟล์แยกใน `/etc/sudoers.d/` (แนะนำ)

วิธีนี้ดีกว่าเพราะไม่แตะไฟล์ sudoers หลัก จัดการและลบออกได้ง่ายกว่า

```bash
# สร้างไฟล์สำหรับ user alice
sudo visudo -f /etc/sudoers.d/alice
```

เพิ่มเนื้อหาในไฟล์:

```bash
alice ALL=(ALL) NOPASSWD: ALL
```

```bash
# ตรวจสอบ syntax ของไฟล์
sudo visudo -c -f /etc/sudoers.d/alice

# ดูไฟล์ที่สร้างไว้
ls -la /etc/sudoers.d/

# ลบสิทธิ์ออกได้ง่ายโดยลบไฟล์ทิ้ง
sudo rm /etc/sudoers.d/alice
```

---

#### วิธีที่ 3 — กำหนดเฉพาะบางคำสั่งที่ไม่ต้องพิมพ์รหัสผ่าน

```bash
sudo visudo -f /etc/sudoers.d/alice
```

```bash
# อนุญาตเฉพาะคำสั่งที่ระบุโดยไม่ต้องพิมพ์รหัสผ่าน
alice ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/systemctl

# คำสั่งอื่นนอกจากนี้ยังต้องพิมพ์รหัสผ่านตามปกติ
alice ALL=(ALL) ALL
```

---

### ทำความเข้าใจรูปแบบของ sudoers

```
alice   ALL=(ALL:ALL)   NOPASSWD: ALL
│       │    │   │      │         │
│       │    │   │      │         └── คำสั่งที่อนุญาต
│       │    │   │      └──────────── ไม่ต้องพิมพ์รหัสผ่าน
│       │    │   └─────────────────── รันในฐานะ group ใดก็ได้
│       │    └─────────────────────── รันในฐานะ user ใดก็ได้
│       └──────────────────────────── จาก host ใดก็ได้
└──────────────────────────────────── ชื่อ user หรือ %group
```

**ตัวอย่างการกำหนดแบบต่างๆ:**

```bash
# อนุญาตทุกคำสั่ง ต้องพิมพ์รหัสผ่าน
alice ALL=(ALL:ALL) ALL

# อนุญาตทุกคำสั่ง ไม่ต้องพิมพ์รหัสผ่าน
alice ALL=(ALL:ALL) NOPASSWD: ALL

# อนุญาตเฉพาะบางคำสั่ง ไม่ต้องพิมพ์รหัสผ่าน
alice ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/systemctl, /sbin/reboot

# บางคำสั่งพิมพ์รหัสผ่าน บางคำสั่งไม่ต้อง
alice ALL=(ALL) ALL, NOPASSWD: /usr/bin/apt

# อนุญาตทั้ง group โดยไม่ต้องพิมพ์รหัสผ่าน
%developers ALL=(ALL) NOPASSWD: ALL

# รันในฐานะ user ที่ระบุเท่านั้น
alice ALL=(www-data) NOPASSWD: ALL
```

---

### ตรวจสอบและยืนยันสิทธิ์ sudo

```bash
# ดูสิทธิ์ sudo ทั้งหมดของ user ปัจจุบัน
sudo -l

# ดูสิทธิ์ sudo ของ user อื่น
sudo -lU alice

# ทดสอบว่าไม่ต้องพิมพ์รหัสผ่านแล้ว
sudo apt update

# ตรวจสอบ syntax ของ sudoers ทั้งหมด
sudo visudo -c
```

**ตัวอย่างผลลัพธ์ `sudo -lU alice`:**
```
Matching Defaults entries for alice on hostname:
    env_reset, mail_badpass

User alice may run the following commands on hostname:
    (ALL : ALL) NOPASSWD: ALL
```

---

### ลบสิทธิ์ sudo NOPASSWD

```bash
# วิธีที่ 1 — ลบไฟล์ใน sudoers.d (ถ้าสร้างแยกไว้)
sudo rm /etc/sudoers.d/alice

# วิธีที่ 2 — แก้ไขใน visudo ลบบรรทัดที่เพิ่มไว้
sudo visudo

# วิธีที่ 3 — ลบ user ออกจาก group sudo
sudo deluser alice sudo

# ตรวจสอบว่าลบสิทธิ์แล้ว
sudo -lU alice
```

---

## 11. สคริปต์ที่มีประโยชน์

### สคริปต์แสดงข้อมูล User ทั้งหมด

```bash
#!/bin/bash
# แสดงรายการ Regular User ทั้งหมด
echo "================================================"
echo " รายการ User ในระบบ"
echo "================================================"
printf "%-15s %-6s %-6s %-20s %s\n" "USERNAME" "UID" "GID" "HOME" "SHELL"
echo "------------------------------------------------"
awk -F: '$3 >= 1000 && $3 != 65534 {
    printf "%-15s %-6s %-6s %-20s %s\n", $1, $3, $4, $6, $7
}' /etc/passwd
echo "================================================"
echo "จำนวน Regular User: $(awk -F: '$3 >= 1000 && $3 != 65534' /etc/passwd | wc -l) คน"
```

---

### สคริปต์ตรวจสอบและลบ User อย่างปลอดภัย

```bash
#!/bin/bash
# safe_delete_user.sh — ลบ user อย่างปลอดภัยพร้อม backup

USERNAME=$1
BACKUP_DIR="/backup/users"

if [ -z "$USERNAME" ]; then
    echo "Usage: $0 <username>"
    exit 1
fi

# ตรวจสอบว่า user มีอยู่จริง
if ! id "$USERNAME" &>/dev/null; then
    echo "Error: User '$USERNAME' ไม่มีในระบบ"
    exit 1
fi

echo "=== ข้อมูล User: $USERNAME ==="
id "$USERNAME"
echo ""

# ตรวจสอบว่า user กำลัง login อยู่
if who | grep -q "^$USERNAME"; then
    echo "Warning: User '$USERNAME' กำลัง login อยู่!"
    who | grep "^$USERNAME"
    read -p "ต้องการดำเนินการต่อหรือไม่? (y/N): " confirm
    [ "$confirm" != "y" ] && exit 1
fi

# สำรองข้อมูล
echo "กำลังสำรองข้อมูล..."
sudo mkdir -p "$BACKUP_DIR"
sudo tar -czvf "$BACKUP_DIR/${USERNAME}_$(date +%Y%m%d_%H%M%S).tar.gz" \
    /home/"$USERNAME"/ 2>/dev/null && \
    echo "สำรองข้อมูลสำเร็จที่ $BACKUP_DIR"

# หยุด process ทั้งหมดของ user
echo "กำลังหยุด process ของ $USERNAME..."
sudo pkill -u "$USERNAME" 2>/dev/null

# ลบ user
echo "กำลังลบ user '$USERNAME'..."
sudo deluser --remove-home "$USERNAME"

# ตรวจสอบผล
if ! id "$USERNAME" &>/dev/null; then
    echo "ลบ User '$USERNAME' สำเร็จ"
else
    echo "Error: ไม่สามารถลบ User '$USERNAME' ได้"
fi
```

**วิธีใช้งาน:**
```bash
chmod +x safe_delete_user.sh
sudo ./safe_delete_user.sh alice
```

---

## สรุปคำสั่งที่ใช้บ่อย

### ตรวจสอบ User

| คำสั่ง | หน้าที่ |
|---|---|
| `whoami` | ดู user ปัจจุบัน |
| `id alice` | ดู UID, GID, groups ของ user |
| `who` / `w` | ดู user ที่ login อยู่ |
| `last` | ดูประวัติการ login |
| `lastlog` | ดูการ login ล่าสุดของทุก user |
| `getent passwd alice` | ดูข้อมูล user |
| `groups alice` | ดู group ที่ user สังกัด |
| `sudo passwd -S alice` | ดูสถานะ password |
| `sudo chage -l alice` | ดู password policy |

### สร้างและแก้ไข User

| คำสั่ง | หน้าที่ |
|---|---|
| `sudo adduser alice` | สร้าง user แบบ interactive |
| `sudo useradd -m -s /bin/bash alice` | สร้าง user แบบ manual |
| `sudo passwd alice` | ตั้ง/เปลี่ยน password |
| `sudo usermod -aG sudo alice` | เพิ่ม user เข้า group |
| `sudo usermod -L alice` | ล็อกบัญชี user |
| `sudo usermod -U alice` | ปลดล็อกบัญชี user |
| `sudo chage -M 90 alice` | กำหนดอายุ password |

### ลบ User

| คำสั่ง | หน้าที่ |
|---|---|
| `sudo deluser alice` | ลบ user (เก็บ home ไว้) |
| `sudo deluser --remove-home alice` | ลบ user พร้อม home directory |
| `sudo deluser --remove-all-files alice` | ลบ user พร้อมไฟล์ทั้งหมด |
| `sudo pkill -u alice` | หยุด process ทั้งหมดของ user |

### จัดการ Group

| คำสั่ง | หน้าที่ |
|---|---|
| `sudo addgroup developers` | สร้าง group |
| `sudo adduser alice developers` | เพิ่ม user เข้า group |
| `sudo deluser alice developers` | ลบ user ออกจาก group |
| `sudo groupmod -n new old` | เปลี่ยนชื่อ group |
| `sudo delgroup developers` | ลบ group |
| `getent group developers` | ดูสมาชิกของ group |