---
sidebar_position: 5
id: linux-permissions
title: สิทธิ์และการกำหนดสิทธิ์ไฟล์ใน Linux (Ubuntu)
sidebar_label: 4. สิทธิ์ไฟล์ (Permissions)
description: อธิบายระบบสิทธิ์ไฟล์ใน Linux Ubuntu อย่างละเอียด ครอบคลุม chmod, chown, chgrp, SUID, SGID, Sticky Bit และ ACL
---

# สิทธิ์และการกำหนดสิทธิ์ไฟล์ใน Linux (Ubuntu)

Linux มีระบบสิทธิ์ (Permission) ที่ละเอียดและรัดกุม เพื่อควบคุมว่าใครสามารถอ่าน เขียน หรือรันไฟล์ได้บ้าง การเข้าใจระบบนี้เป็นพื้นฐานสำคัญสำหรับการดูแลความปลอดภัยของระบบ

---

## 1. ทำความเข้าใจระบบสิทธิ์ใน Linux

### โครงสร้างสิทธิ์

เมื่อรัน `ls -l` จะเห็นข้อมูลสิทธิ์ในรูปแบบนี้:

```
-rwxr-xr--  1  alice  developers  4096  Jan 10 09:00  script.sh
```

แยกส่วนประกอบได้ดังนี้:

```
- rwx r-x r--
│ │││ │││ │││
│ │││ │││ └┴┴── Other  : r-- (อ่านได้อย่างเดียว)
│ │││ └┴┴────── Group   : r-x (อ่านและรันได้)
│ └┴┴────────── Owner   : rwx (อ่าน เขียน และรันได้)
└────────────── ประเภท  : - = file, d = directory, l = symlink
```

---

### ประเภทของไฟล์ (File Type)

| สัญลักษณ์ | ประเภท |
|---|---|
| `-` | ไฟล์ปกติ (Regular file) |
| `d` | โฟลเดอร์ (Directory) |
| `l` | Symbolic link |
| `c` | Character device |
| `b` | Block device |
| `p` | Named pipe (FIFO) |
| `s` | Socket |

---

### ประเภทของผู้ใช้ (User Types)

| ย่อ | ชื่อเต็ม | ความหมาย |
|---|---|---|
| `u` | User / Owner | เจ้าของไฟล์ |
| `g` | Group | กลุ่มที่ไฟล์สังกัด |
| `o` | Others | ผู้ใช้คนอื่นทั้งหมด |
| `a` | All | ทุกคน (u + g + o) |

---

### ประเภทของสิทธิ์ (Permission Types)

| สัญลักษณ์ | ค่า | ไฟล์ | โฟลเดอร์ |
|---|---|---|---|
| `r` | 4 | อ่านเนื้อหาได้ | ดูรายการไฟล์ได้ (`ls`) |
| `w` | 2 | แก้ไข/เขียนได้ | สร้าง/ลบไฟล์ในโฟลเดอร์ได้ |
| `x` | 1 | รันได้ (execute) | เข้าโฟลเดอร์ได้ (`cd`) |
| `-` | 0 | ไม่มีสิทธิ์ | ไม่มีสิทธิ์ |

:::warning 
ข้อควรรู้เกี่ยวกับสิทธิ์โฟลเดอร์
สิทธิ์ `x` บนโฟลเดอร์สำคัญมาก หากไม่มีสิทธิ์ `x` จะไม่สามารถ `cd` เข้าโฟลเดอร์ได้ แม้จะมีสิทธิ์ `r` ก็ตาม
:::

---

## 2. การอ่านค่าสิทธิ์แบบ Octal (ตัวเลข)

สิทธิ์แต่ละชุดคำนวณจากการรวมค่า `r=4`, `w=2`, `x=1`

```
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
-wx = 0+2+1 = 3
-w- = 0+2+0 = 2
--x = 0+0+1 = 1
--- = 0+0+0 = 0
```

**ตัวอย่างการอ่าน:**

| Octal | สัญลักษณ์ | ความหมาย |
|---|---|---|
| `777` | `rwxrwxrwx` | ทุกคนมีทุกสิทธิ์ |
| `755` | `rwxr-xr-x` | owner ทำได้ทุกอย่าง, อื่นๆ อ่านและรันได้ |
| `644` | `rw-r--r--` | owner อ่าน/เขียน, อื่นๆ อ่านได้ |
| `600` | `rw-------` | owner อ่าน/เขียนเท่านั้น |
| `700` | `rwx------` | owner ทำได้ทุกอย่าง, อื่นๆ ทำอะไรไม่ได้ |
| `664` | `rw-rw-r--` | owner และ group อ่าน/เขียน, อื่นๆ อ่านได้ |
| `400` | `r--------` | owner อ่านได้อย่างเดียว |

---

## 3. `chmod` — เปลี่ยนสิทธิ์ไฟล์

### แบบ Octal (ตัวเลข)

```bash
# กำหนดสิทธิ์ทั้งหมดด้วยตัวเลข
chmod 755 script.sh
chmod 644 document.txt
chmod 600 private_key
chmod 777 public_file.txt
chmod 000 no_access.txt

# เปลี่ยนสิทธิ์แบบ recursive (ทุกไฟล์ในโฟลเดอร์)
chmod -R 755 /var/www/html/

# แสดงไฟล์ที่กำลังเปลี่ยน (verbose)
chmod -v 644 file.txt
```

---

### แบบสัญลักษณ์ (Symbolic)

```bash
# ── เพิ่มสิทธิ์ (+) ──
chmod u+x script.sh        # เพิ่มสิทธิ์ execute ให้ owner
chmod g+w file.txt         # เพิ่มสิทธิ์ write ให้ group
chmod o+r file.txt         # เพิ่มสิทธิ์ read ให้ others
chmod a+x script.sh        # เพิ่มสิทธิ์ execute ให้ทุกคน
chmod u+rx script.sh       # เพิ่มสิทธิ์ read และ execute ให้ owner

# ── ลบสิทธิ์ (-) ──
chmod u-x script.sh        # ลบสิทธิ์ execute จาก owner
chmod g-w file.txt         # ลบสิทธิ์ write จาก group
chmod o-rwx file.txt       # ลบสิทธิ์ทั้งหมดจาก others
chmod a-w file.txt         # ลบสิทธิ์ write จากทุกคน

# ── กำหนดสิทธิ์ (=) ──
chmod u=rwx script.sh      # กำหนดสิทธิ์ owner เป็น rwx
chmod g=rx file.txt        # กำหนดสิทธิ์ group เป็น r-x
chmod o= file.txt          # ลบสิทธิ์ others ทั้งหมด

# ── หลายกลุ่มพร้อมกัน ──
chmod u=rwx,g=rx,o=r script.sh   # กำหนดสิทธิ์ทั้ง 3 กลุ่มพร้อมกัน
chmod u+x,o-r file.txt            # เพิ่ม owner execute, ลบ others read
```

---

### ค่าสิทธิ์ที่แนะนำสำหรับงานต่างๆ

| ไฟล์/โฟลเดอร์ | Octal | เหตุผล |
|---|---|---|
| Shell script | `755` | owner รันได้, อื่นๆ อ่านและรันได้ |
| ไฟล์ข้อมูลทั่วไป | `644` | owner แก้ไขได้, อื่นๆ อ่านได้ |
| ไฟล์ config ส่วนตัว | `600` | เฉพาะ owner อ่าน/เขียน |
| SSH Private Key | `400` | เฉพาะ owner อ่านได้ |
| Web root directory | `755` | web server เข้าถึงได้ |
| โฟลเดอร์ส่วนตัว | `700` | เฉพาะ owner เข้าถึงได้ |
| ไฟล์ที่แชร์ใน group | `664` | owner และ group แก้ไขได้ |

---

## 4. `chown` — เปลี่ยนเจ้าของไฟล์

```bash
# เปลี่ยนเจ้าของไฟล์
sudo chown alice file.txt

# เปลี่ยนเจ้าของและกลุ่มพร้อมกัน
sudo chown alice:developers file.txt

# เปลี่ยนเฉพาะกลุ่ม (ใช้ : นำหน้า)
sudo chown :developers file.txt

# เปลี่ยนเจ้าของแบบ recursive
sudo chown -R alice:developers /var/www/html/

# เปลี่ยนเจ้าของโดยอ้างอิงจากไฟล์อื่น
sudo chown --reference=reference_file.txt target_file.txt

# แสดงไฟล์ที่กำลังเปลี่ยน (verbose)
sudo chown -v alice file.txt
```

---

## 5. `chgrp` — เปลี่ยนกลุ่มของไฟล์

```bash
# เปลี่ยนกลุ่มของไฟล์
sudo chgrp developers file.txt

# เปลี่ยนกลุ่มแบบ recursive
sudo chgrp -R developers /var/www/html/

# เปลี่ยนกลุ่มโดยอ้างอิงจากไฟล์อื่น
sudo chgrp --reference=reference_file.txt target_file.txt
```

---

## 6. การจัดการ User และ Group

### จัดการ User

```bash
# ดู user ปัจจุบัน
whoami

# ดูข้อมูล user และ group ที่สังกัด
id
id username

# ดูรายการ user ทั้งหมด
cat /etc/passwd

# สร้าง user ใหม่
sudo adduser alice

# สร้าง user แบบกำหนดเอง
sudo useradd -m -s /bin/bash -d /home/alice alice

# ตั้งหรือเปลี่ยน password
sudo passwd alice

# เปลี่ยนชื่อ user
sudo usermod -l new_username old_username

# เปลี่ยน home directory
sudo usermod -d /new/home/path -m alice

# ลบ user
sudo deluser alice

# ลบ user พร้อม home directory
sudo deluser --remove-home alice
```

---

### จัดการ Group

```bash
# ดูรายการ group ทั้งหมด
cat /etc/group

# ดู group ที่ user สังกัด
groups
groups username

# สร้าง group ใหม่
sudo addgroup developers

# เพิ่ม user เข้า group
sudo adduser alice developers
sudo usermod -aG developers alice

# เพิ่ม user เข้าหลาย group
sudo usermod -aG developers,docker,sudo alice

# ลบ user ออกจาก group
sudo deluser alice developers
sudo gpasswd -d alice developers

# ลบ group
sudo delgroup developers

# เปลี่ยนชื่อ group
sudo groupmod -n new_group_name old_group_name
```

---

### `sudo` — รันคำสั่งในฐานะ root

```bash
# รันคำสั่งในฐานะ root
sudo command

# เปิด shell ในฐานะ root
sudo -i
sudo su

# รันคำสั่งในฐานะ user อื่น
sudo -u username command

# ดูสิทธิ์ sudo ของตัวเอง
sudo -l

# เพิ่ม user เข้ากลุ่ม sudo
sudo adduser alice sudo
sudo usermod -aG sudo alice
```

---

### แก้ไขไฟล์ sudoers

```bash
# แก้ไขด้วย visudo (ปลอดภัยกว่าการแก้ตรง)
sudo visudo
```

**รูปแบบในไฟล์ sudoers:**

```bash
# อนุญาตให้ alice รันทุกคำสั่ง
alice ALL=(ALL:ALL) ALL

# อนุญาตให้ alice รันโดยไม่ต้องใส่ password
alice ALL=(ALL) NOPASSWD: ALL

# อนุญาตให้ alice รันเฉพาะคำสั่งที่กำหนด
alice ALL=(ALL) /usr/bin/apt, /usr/bin/systemctl

# อนุญาตทุกคนใน group developers
%developers ALL=(ALL) ALL
```

---

## 7. Special Permissions (SUID, SGID, Sticky Bit)

นอกจากสิทธิ์พื้นฐาน `rwx` แล้ว Linux ยังมีสิทธิ์พิเศษอีก 3 แบบ

### SUID (Set User ID) — ค่า 4

เมื่อไฟล์ที่มี SUID ถูกรัน จะทำงานในฐานะ **เจ้าของไฟล์** ไม่ใช่ผู้ที่รัน

```bash
# ดูไฟล์ที่มี SUID (สังเกต s แทน x ของ owner)
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root ... /usr/bin/passwd

# กำหนด SUID
chmod u+s file
chmod 4755 file

# ลบ SUID
chmod u-s file

# ค้นหาไฟล์ที่มี SUID ในระบบ
find / -perm -4000 -type f 2>/dev/null
```

:::info 
ตัวอย่างการใช้งาน SUID
คำสั่ง `/usr/bin/passwd` มี SUID ทำให้ผู้ใช้ทั่วไปสามารถเปลี่ยน password ของตัวเองได้ โดยที่คำสั่งจะทำงานในฐานะ root เพื่อแก้ไขไฟล์ `/etc/shadow`
:::

---

### SGID (Set Group ID) — ค่า 2

**บนไฟล์:** เมื่อรัน จะทำงานในฐานะ **กลุ่มของไฟล์**

**บนโฟลเดอร์:** ไฟล์ใหม่ที่สร้างในโฟลเดอร์จะสืบทอด **กลุ่มของโฟลเดอร์** โดยอัตโนมัติ

```bash
# ดูไฟล์ที่มี SGID (สังเกต s แทน x ของ group)
ls -ld /usr/bin/write
# -rwxr-sr-x 1 root tty ... /usr/bin/write

# กำหนด SGID บนโฟลเดอร์ (ไฟล์ใหม่จะสืบทอด group)
chmod g+s /shared/folder
chmod 2755 /shared/folder

# ลบ SGID
chmod g-s /shared/folder

# ค้นหาไฟล์ที่มี SGID
find / -perm -2000 -type f 2>/dev/null
```

:::info 
ตัวอย่างการใช้งาน SGID
ใช้ SGID บนโฟลเดอร์ที่แชร์งานในทีม เพื่อให้ไฟล์ใหม่ที่สร้างโดย user ใดก็ตามสืบทอด group ของโฟลเดอร์โดยอัตโนมัติ ทุกคนใน group จึงเข้าถึงไฟล์ได้
:::

---

### Sticky Bit — ค่า 1

ใช้กับ**โฟลเดอร์** เพื่อให้ผู้ใช้ลบได้เฉพาะไฟล์ที่ตัวเองเป็นเจ้าของเท่านั้น แม้จะมีสิทธิ์ write บนโฟลเดอร์

```bash
# ดูโฟลเดอร์ที่มี sticky bit (สังเกต t แทน x ของ others)
ls -ld /tmp
# drwxrwxrwt 10 root root ... /tmp

# กำหนด sticky bit
chmod +t /shared/folder
chmod 1777 /shared/folder

# ลบ sticky bit
chmod -t /shared/folder

# ค้นหาโฟลเดอร์ที่มี sticky bit
find / -perm -1000 -type d 2>/dev/null
```

:::info 
ตัวอย่างการใช้งาน Sticky Bit
โฟลเดอร์ `/tmp` มี sticky bit ทำให้ทุกคนสร้างไฟล์ชั่วคราวได้ แต่ลบได้เฉพาะไฟล์ของตัวเองเท่านั้น ป้องกันไม่ให้ผู้ใช้คนอื่นลบไฟล์ของกัน
:::

---

### ตาราง Special Permissions

| สิทธิ์ | ค่า | บนไฟล์ | บนโฟลเดอร์ | สัญลักษณ์ |
|---|---|---|---|---|
| SUID | 4 | รันในฐานะ owner | ไม่มีผล | `s` (แทน x ของ owner) |
| SGID | 2 | รันในฐานะ group | ไฟล์ใหม่สืบทอด group | `s` (แทน x ของ group) |
| Sticky | 1 | ไม่มีผล | ลบได้เฉพาะไฟล์ตัวเอง | `t` (แทน x ของ others) |

---

## 8. `umask` — ค่า Default Permission

`umask` กำหนดสิทธิ์ **ที่ถูกตัดออก** เมื่อสร้างไฟล์หรือโฟลเดอร์ใหม่

```bash
# ดูค่า umask ปัจจุบัน
umask
# 0022

# ดูแบบสัญลักษณ์
umask -S
# u=rwx,g=rx,o=rx
```

**การคำนวณสิทธิ์จาก umask:**

```
ไฟล์ใหม่:      666 - 022 = 644  (rw-r--r--)
โฟลเดอร์ใหม่:  777 - 022 = 755  (rwxr-xr-x)
```

```bash
# ตั้งค่า umask (เฉพาะ session ปัจจุบัน)
umask 027    # ไฟล์ใหม่ = 640, โฟลเดอร์ใหม่ = 750

# ค่า umask ที่ใช้บ่อย
umask 022    # ค่าเริ่มต้น (ไฟล์=644, โฟลเดอร์=755)
umask 027    # ปลอดภัยขึ้น (ไฟล์=640, โฟลเดอร์=750)
umask 077    # เข้มงวดสูงสุด (ไฟล์=600, โฟลเดอร์=700)

# ตั้งค่าถาวรใน ~/.bashrc หรือ ~/.profile
echo "umask 027" >> ~/.bashrc
```

---

## 9. ACL (Access Control List) — สิทธิ์ขั้นสูง

ACL ช่วยให้กำหนดสิทธิ์ให้ **user หรือ group เฉพาะเจาะจง** ได้ละเอียดกว่าระบบ `rwx` ปกติ

```bash
# ติดตั้ง
sudo apt install acl

# ดู ACL ของไฟล์
getfacl file.txt

# กำหนดสิทธิ์ให้ user เฉพาะ
setfacl -m u:bob:rw file.txt

# กำหนดสิทธิ์ให้ group เฉพาะ
setfacl -m g:developers:rx /var/www/html/

# กำหนดสิทธิ์แบบ recursive
setfacl -R -m u:bob:rw /shared/folder/

# กำหนด default ACL (ไฟล์ใหม่ในโฟลเดอร์จะสืบทอด)
setfacl -d -m u:bob:rw /shared/folder/

# ลบ ACL ของ user
setfacl -x u:bob file.txt

# ลบ ACL ทั้งหมด
setfacl -b file.txt
```

**ตัวอย่างผลลัพธ์ `getfacl`:**

```
# file: file.txt
# owner: alice
# group: developers
user::rw-
user:bob:rw-
group::r--
group:testers:r--
mask::rw-
other::r--
```

---

## 10. `lsattr` และ `chattr` — Immutable Attributes

สิทธิ์ระดับ filesystem ที่แม้แต่ root ก็ไม่สามารถแก้ไขได้ (หากตั้ง immutable)

```bash
# ดู attributes ของไฟล์
lsattr file.txt

# ทำให้ไฟล์ไม่สามารถแก้ไขหรือลบได้ (immutable)
sudo chattr +i file.txt

# ทดสอบ (จะได้รับ error แม้เป็น root)
sudo rm file.txt
# rm: cannot remove 'file.txt': Operation not permitted

# ยกเลิก immutable
sudo chattr -i file.txt

# ทำให้ไฟล์เพิ่มข้อมูลได้อย่างเดียว (append-only)
sudo chattr +a logfile.txt

# ดู attributes ทั้งหมดในโฟลเดอร์
lsattr -R /etc/
```

**Attributes ที่ใช้บ่อย:**

| Attribute | ความหมาย |
|---|---|
| `i` | Immutable — ห้ามแก้ไข เปลี่ยนชื่อ หรือลบ |
| `a` | Append-only — เพิ่มข้อมูลได้อย่างเดียว |
| `e` | Extent format — ใช้ extents สำหรับ mapping |
| `s` | Secure deletion — เขียนทับเมื่อลบ |

---

## สรุปคำสั่งที่ใช้บ่อย

| คำสั่ง | หน้าที่ |
|---|---|
| `ls -l` | ดูสิทธิ์ไฟล์ |
| `chmod 755 file` | กำหนดสิทธิ์แบบ octal |
| `chmod u+x file` | กำหนดสิทธิ์แบบ symbolic |
| `chmod -R 755 dir/` | กำหนดสิทธิ์แบบ recursive |
| `chown user:group file` | เปลี่ยนเจ้าของและกลุ่ม |
| `chgrp group file` | เปลี่ยนกลุ่ม |
| `chmod 4755 file` | กำหนด SUID |
| `chmod 2755 dir/` | กำหนด SGID |
| `chmod 1777 dir/` | กำหนด Sticky Bit |
| `umask` | ดูค่า default permission |
| `getfacl file` | ดู ACL |
| `setfacl -m u:bob:rw file` | กำหนด ACL |
| `chattr +i file` | ทำให้ไฟล์ immutable |
| `lsattr file` | ดู file attributes |
| `sudo adduser alice sudo` | เพิ่ม user เข้ากลุ่ม sudo |