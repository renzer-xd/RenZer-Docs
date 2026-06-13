---
sidebar_position: 10
title: 9. การตั้งค่า SFTP Server
---

# คู่มือการตั้งค่า SFTP Server อย่างละเอียด

**SFTP (SSH File Transfer Protocol)** คือโปรโตคอลสำหรับรับ-ส่งไฟล์อย่างปลอดภัยผ่านช่องทางเดียวกับ SSH โดยเข้ารหัสข้อมูลทั้งหมดระหว่างการรับส่ง ต่างจาก FTP แบบดั้งเดิมที่ส่งข้อมูลแบบ Plain Text ซึ่งดักฟังได้ง่าย

> **ข้อดีของ SFTP เหนือกว่า FTP/FTPS:**
> - ใช้พอร์ตเดียวกับ SSH (พอร์ต 22) ไม่ต้องเปิดพอร์ตเพิ่ม
> - เข้ารหัสทั้ง credentials และข้อมูลไฟล์ตลอดการเชื่อมต่อ
> - รองรับ SSH Key Authentication แทนรหัสผ่าน
> - ไม่ต้องติดตั้งซอฟต์แวร์เพิ่มเติม — OpenSSH รองรับ SFTP ในตัวอยู่แล้ว

---

## 📋 ภาพรวมสิ่งที่จะตั้งค่าในคู่มือนี้

คู่มือนี้จะสร้าง SFTP Server แบบที่ใช้งานจริงในองค์กร โดยมีโครงสร้างดังนี้:

```text
/srv/sftp/
├── shared/          ← โฟลเดอร์กลาง (ทุกคนในกลุ่ม sftp-users เข้าถึงได้)
│   └── uploads/
└── users/
    ├── alice/       ← โฟลเดอร์ส่วนตัวของ alice (เฉพาะ alice เข้าได้)
    │   └── uploads/
    └── bob/         ← โฟลเดอร์ส่วนตัวของ bob (เฉพาะ bob เข้าได้)
        └── uploads/
```

ผู้ใช้แต่ละคนจะถูก **Chroot Jail** ให้อยู่แค่ในโฟลเดอร์ของตัวเอง มองไม่เห็นโครงสร้างไฟล์ระบบอื่น และไม่สามารถเปิด Shell หรือรันคำสั่งใดๆ ได้

---

## 👥 1. สร้างกลุ่มและผู้ใช้งาน SFTP

### A. สร้างกลุ่ม `sftp-users`

การสร้างกลุ่มแยกต่างหากทำให้จัดการสิทธิ์ได้ง่าย เพียงเพิ่มหรือถอด User ออกจากกลุ่มนี้ก็ควบคุมการเข้าถึง SFTP ได้ทันที:

```bash
sudo groupadd sftp-users
```

### B. สร้าง User สำหรับ SFTP

```bash
# สร้าง User alice — ไม่มี Login Shell (nologin) เพราะเข้าได้เฉพาะ SFTP เท่านั้น
sudo useradd -m -s /usr/sbin/nologin -G sftp-users alice

# สร้าง User bob แบบเดียวกัน
sudo useradd -m -s /usr/sbin/nologin -G sftp-users bob

# ตั้งรหัสผ่านให้แต่ละ User (กรณีใช้ Password Authentication)
sudo passwd alice
sudo passwd bob
```

> [!TIP]
> ถ้าต้องการใช้ **SSH Key Authentication แทนรหัสผ่าน** (ปลอดภัยกว่ามาก) ให้ข้ามขั้นตอน `passwd` ไป แล้วไปทำ Section 4 ก่อน

---

## 📁 2. สร้างโครงสร้างโฟลเดอร์และกำหนดสิทธิ์

ข้อกำหนดบังคับของ OpenSSH Chroot: **โฟลเดอร์ root ของ Chroot และทุกโฟลเดอร์แม่ต้องมีเจ้าของเป็น `root` และห้ามให้ Group/Others มีสิทธิ์ Write** มิฉะนั้น SSH จะปฏิเสธการเชื่อมต่อพร้อม Error `bad ownership or modes for chroot directory`

### A. สร้างโฟลเดอร์ส่วนกลาง (Shared)

```bash
# สร้างโฟลเดอร์ root ของ Chroot (เจ้าของต้องเป็น root เสมอ)
sudo mkdir -p /srv/sftp/shared
sudo chown root:root /srv/sftp/shared
sudo chmod 755 /srv/sftp/shared

# สร้างโฟลเดอร์ uploads ภายในที่ทุกคนในกลุ่ม sftp-users เขียนได้
sudo mkdir -p /srv/sftp/shared/uploads
sudo chown root:sftp-users /srv/sftp/shared/uploads
sudo chmod 775 /srv/sftp/shared/uploads
```

### B. สร้างโฟลเดอร์ส่วนตัวของแต่ละ User

```bash
# โฟลเดอร์ของ alice
sudo mkdir -p /srv/sftp/users/alice
sudo chown root:root /srv/sftp/users/alice      # root เป็นเจ้าของ (บังคับของ Chroot)
sudo chmod 755 /srv/sftp/users/alice

sudo mkdir -p /srv/sftp/users/alice/uploads
sudo chown alice:alice /srv/sftp/users/alice/uploads
sudo chmod 700 /srv/sftp/users/alice/uploads    # เฉพาะ alice เท่านั้นที่เข้าได้

# โฟลเดอร์ของ bob
sudo mkdir -p /srv/sftp/users/bob
sudo chown root:root /srv/sftp/users/bob
sudo chmod 755 /srv/sftp/users/bob

sudo mkdir -p /srv/sftp/users/bob/uploads
sudo chown bob:bob /srv/sftp/users/bob/uploads
sudo chmod 700 /srv/sftp/users/bob/uploads
```

### C. ตรวจสอบโครงสร้างสิทธิ์ที่สร้างไว้

```bash
ls -la /srv/sftp/
# ผลลัพธ์ที่ถูกต้อง:
# drwxr-xr-x  root root   shared/
# drwxr-xr-x  root root   users/

ls -la /srv/sftp/users/
# ผลลัพธ์ที่ถูกต้อง:
# drwxr-xr-x  root root   alice/
# drwxr-xr-x  root root   bob/

ls -la /srv/sftp/users/alice/
# ผลลัพธ์ที่ถูกต้อง:
# drwx------  alice alice  uploads/
```

---

## ⚙️ 3. คอนฟิก SSH Daemon (`sshd_config`)

```bash
sudo nano /etc/ssh/sshd_config
```

เลื่อนลงไปที่ล่างสุดของไฟล์ แล้วเพิ่มบล็อกนี้ต่อท้าย:

```text
# ===== SFTP Server Configuration =====

# ปิดการใช้ SFTP Subsystem แบบเดิม (บรรทัดนี้อาจมีอยู่แล้วในไฟล์ ให้ Comment ออก)
# Subsystem sftp /usr/lib/openssh/sftp-server

# ใช้ internal-sftp แทน (ทำงานในกระบวนการเดียวกับ sshd รองรับ Chroot ได้ดีกว่า)
Subsystem sftp internal-sftp

# ===== กฎสำหรับกลุ่ม sftp-users ทั้งหมด =====
Match Group sftp-users
    # บังคับให้ใช้ SFTP เท่านั้น ไม่สามารถเปิด Shell หรือรันคำสั่งได้
    ForceCommand internal-sftp

    # ปิด Feature ที่ไม่จำเป็นและเสี่ยงต่อความปลอดภัย
    AllowTcpForwarding no
    X11Forwarding no
    AllowAgentForwarding no
    PermitTunnel no

# ===== Chroot แยกต่างหากสำหรับแต่ละ User =====
Match User alice
    ChrootDirectory /srv/sftp/users/alice
    ForceCommand internal-sftp -l INFO   # บันทึก Log ทุกการกระทำของ alice

Match User bob
    ChrootDirectory /srv/sftp/users/bob
    ForceCommand internal-sftp -l INFO
```

> [!TIP]
> **`-l INFO`** ใน `ForceCommand internal-sftp -l INFO` คือการสั่งให้บันทึก Log ระดับ INFO ซึ่งจะเก็บประวัติการ Upload/Download/Delete ของแต่ละ User ไว้ใน `/var/log/auth.log` เหมาะสำหรับการตรวจสอบย้อนหลัง (Audit)

---

## 🔑 4. ตั้งค่า SSH Key Authentication สำหรับ SFTP (แนะนำ)

การใช้ SSH Key แทนรหัสผ่านปลอดภัยกว่ามาก เพราะไม่มีรหัสผ่านให้ Brute-force ได้

```bash
# สร้างโฟลเดอร์ .ssh ของ alice (ต้องอยู่นอก Chroot เพราะ SSH อ่านคีย์ก่อน Chroot ทำงาน)
sudo mkdir -p /home/alice/.ssh
sudo chown alice:alice /home/alice/.ssh
sudo chmod 700 /home/alice/.ssh

# สร้างไฟล์ authorized_keys และวาง Public Key ของ alice ลงไป
sudo nano /home/alice/.ssh/authorized_keys
# (วาง Public Key ของ alice แล้วบันทึก)

# กำหนดสิทธิ์ไฟล์ให้ถูกต้อง
sudo chown alice:alice /home/alice/.ssh/authorized_keys
sudo chmod 600 /home/alice/.ssh/authorized_keys
```

> [!WARNING]
> ไฟล์ `authorized_keys` ต้องอยู่ที่ `/home/alice/.ssh/` (Home Directory จริง) **ไม่ใช่** ภายใน `/srv/sftp/users/alice/` เพราะ SSH daemon อ่านคีย์ก่อนที่จะทำ Chroot ถ้าวางคีย์ไว้ใน Chroot Directory จะหาไม่เจอและล็อกอินไม่ได้

---

## ✅ 5. ตรวจสอบและเริ่มใช้งาน

### A. ตรวจสอบ Syntax ก่อน Restart (สำคัญมาก)

```bash
sudo sshd -t
# ถ้าไม่มี output ใดๆ = ไฟล์ถูกต้อง พร้อม restart ได้
# ถ้ามี Error แสดง = มี syntax ผิด ต้องแก้ก่อน restart
```

### B. Restart SSH Daemon

```bash
sudo systemctl restart sshd

# ตรวจสอบว่า sshd ทำงานปกติหลัง restart
sudo systemctl status sshd
```

### C. ทดสอบเชื่อมต่อจากเครื่อง Windows

```bash
# ทดสอบด้วย Command Line (PowerShell หรือ CMD)
sftp alice@server_ip

# กรณีใช้ SSH Key
sftp -i C:\Users\username\.ssh\id_ed25519 alice@server_ip

# กรณีเซิร์ฟเวอร์ใช้พอร์ตที่กำหนดเอง (เช่น 22022)
sftp -P 22022 alice@server_ip
```

เมื่อเชื่อมต่อสำเร็จจะเข้าสู่ SFTP Shell ทดสอบคำสั่งพื้นฐาน:

```bash
# แสดงไฟล์ในโฟลเดอร์ปัจจุบัน
ls

# ควรเห็นแค่โฟลเดอร์ uploads/ เท่านั้น (Chroot ทำงานถูกต้อง)

# อัปโหลดไฟล์จากเครื่อง Windows ไปยังเซิร์ฟเวอร์
put C:\Users\username\Documents\report.pdf uploads/

# ดาวน์โหลดไฟล์จากเซิร์ฟเวอร์มาเครื่อง Windows
get uploads/report.pdf C:\Users\username\Downloads\

# ออกจาก SFTP Shell
exit
```

---

## 🖥️ 6. การเชื่อมต่อ SFTP ผ่านโปรแกรม GUI บน Windows

สำหรับผู้ที่ไม่คุ้นเคยกับ Command Line มีโปรแกรม GUI ยอดนิยมให้เลือกใช้:

### WinSCP (แนะนำ)

WinSCP เป็นโปรแกรม SFTP/SCP Client ฟรีที่ใช้งานง่ายที่สุดบน Windows รองรับทั้ง Password และ SSH Key Authentication

**ขั้นตอนการตั้งค่า:**

1. ดาวน์โหลดและติดตั้ง WinSCP จาก [winscp.net](https://winscp.net)
2. เปิดโปรแกรม จะมีหน้าต่าง **Login** ปรากฏขึ้น
3. กรอกข้อมูลในช่อง:
   - **File protocol:** เลือก `SFTP`
   - **Host name:** IP ของเซิร์ฟเวอร์
   - **Port number:** พอร์ตที่ใช้ (เช่น `22` หรือ `22022`)
   - **User name:** ชื่อ User (เช่น `alice`)
   - **Password:** รหัสผ่าน (ถ้าใช้ Password Authentication)
4. **กรณีใช้ SSH Key:** คลิกปุ่ม **Advanced** → **SSH** → **Authentication** → ในช่อง **Private key file** เลือกไฟล์ `.ppk` ที่แปลงไว้จาก PuTTYgen (ดู Section การใช้งาน PuTTY ในคู่มือ SSH)
5. คลิก **Save** เพื่อบันทึก Session ไว้ใช้รอบหน้า แล้วกด **Login**
6. เมื่อเชื่อมต่อสำเร็จ จะเห็นหน้าจอแบ่งสองฝั่ง: ซ้ายคือไฟล์บนเครื่อง Windows, ขวาคือไฟล์บนเซิร์ฟเวอร์ — ลากวางไฟล์ระหว่างสองฝั่งได้ทันที

---

## 📊 7. การตรวจสอบ Log การใช้งาน SFTP

ทุกการกระทำของ User ที่ตั้งค่า `-l INFO` ไว้จะถูกบันทึกลงใน System Log:

```bash
# ดู Log ของ SFTP แบบ Real-time
sudo tail -f /var/log/auth.log | grep sftp

# ดู Log ย้อนหลังของ alice
sudo grep "alice" /var/log/auth.log | grep sftp

# ตัวอย่าง Log ที่จะเห็น:
# Jun 12 10:30:15 server sshd: open "/uploads/report.pdf" flags WRITE,CREATE
# Jun 12 10:30:16 server sshd: close "/uploads/report.pdf" bytes read 0 written 204800
# Jun 12 10:31:00 server sshd: remove name "/uploads/old-file.txt"
```

---

## 🔧 8. การแก้ปัญหาที่พบบ่อย (Troubleshooting)

| ข้อผิดพลาด | สาเหตุที่พบบ่อย | วิธีแก้ไข |
|:---|:---|:---|
| `bad ownership or modes for chroot directory` | โฟลเดอร์ Chroot ไม่ได้เป็นของ root หรือ Group/Others มีสิทธิ์ Write | `sudo chown root:root <path>` และ `sudo chmod 755 <path>` |
| `Connection refused` | sshd ไม่ได้รันอยู่ หรือ Firewall บล็อกพอร์ต | `sudo systemctl start sshd` และตรวจสอบ `ufw` |
| `Permission denied (publickey)` | ไฟล์ `authorized_keys` สิทธิ์ผิด หรือวางคีย์ผิดที่ | ตรวจสอบสิทธิ์ `600` และตำแหน่ง `/home/user/.ssh/` |
| `This service allows sftp connections only` | ตั้งค่า `ForceCommand internal-sftp` ถูกต้องแล้ว แต่ลอง SSH ปกติแทน SFTP | ใช้คำสั่ง `sftp` แทน `ssh` |
| ล็อกอินสำเร็จแต่เห็นโฟลเดอร์ว่างเปล่า | ยังไม่ได้สร้างโฟลเดอร์ `uploads/` ภายใน Chroot | สร้าง `uploads/` และกำหนดสิทธิ์ให้ User เป็นเจ้าของ |

```bash
# คำสั่งช่วย Debug เมื่อเกิดปัญหา
# ดู Log แบบ Verbose แบบ Real-time
sudo journalctl -u sshd -f

# ทดสอบเชื่อมต่อแบบ Verbose เพื่อดู Error ละเอียด (จากเครื่อง Client)
sftp -v alice@server_ip
```