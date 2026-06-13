---
sidebar_position: 3
id: linux-file-management
title: การจัดการไฟล์และโฟลเดอร์ใน Linux (Ubuntu)
sidebar_label: 2. การจัดการไฟล์และโฟลเดอร์
description: คำสั่งและวิธีการจัดการไฟล์และโฟลเดอร์ใน Linux Ubuntu อย่างละเอียด
---

# การจัดการไฟล์และโฟลเดอร์ใน Linux (Ubuntu)
 
Linux มีชุดคำสั่งที่ทรงพลังสำหรับจัดการไฟล์และโฟลเดอร์ผ่าน Terminal การเรียนรู้คำสั่งเหล่านี้จะช่วยให้ทำงานได้รวดเร็วและมีประสิทธิภาพมากขึ้น
 
---
 
## 1. การดูและนำทางโฟลเดอร์
 
### `pwd` — แสดง path ปัจจุบัน
 
```bash
pwd
```
 
**ผลลัพธ์:**
```
/home/username
```
 
---
 
### `ls` — แสดงรายการไฟล์และโฟลเดอร์
 
```bash
# แสดงรายการพื้นฐาน
ls
 
# แสดงแบบละเอียด (สิทธิ์, ขนาด, วันที่)
ls -l
 
# แสดงไฟล์ซ่อน (ขึ้นต้นด้วย .)
ls -a
 
# รวมทั้งสองแบบ
ls -la
 
# แสดงขนาดแบบอ่านง่าย (KB, MB, GB)
ls -lh
 
# แสดงแบบเรียงตามวันที่ล่าสุด
ls -lt
 
# แสดงไฟล์ในโฟลเดอร์อื่น
ls -l /etc
```
 
**ตัวอย่างผลลัพธ์ `ls -lh`:**
```
total 48K
drwxr-xr-x 2 alice alice 4.0K Jan 10 09:00 Documents
drwxr-xr-x 2 alice alice 4.0K Jan 10 09:00 Downloads
-rw-r--r-- 1 alice alice 3.5K Jan 10 08:30 notes.txt
-rwxr-xr-x 1 alice alice  12K Jan  9 15:00 script.sh
```
 
**คำอธิบายคอลัมน์:**
 
| คอลัมน์ | ความหมาย |
|---|---|
| `drwxr-xr-x` | สิทธิ์การเข้าถึง |
| `2` | จำนวน hard link |
| `alice` | เจ้าของไฟล์ |
| `alice` | กลุ่มของไฟล์ |
| `4.0K` | ขนาดไฟล์ |
| `Jan 10 09:00` | วันที่แก้ไขล่าสุด |
| `Documents` | ชื่อไฟล์/โฟลเดอร์ |
 
---
 
### `cd` — เปลี่ยน directory
 
```bash
# ไปยังโฟลเดอร์ที่ระบุ
cd /home/username/Documents
 
# ไปยังโฟลเดอร์ย่อย
cd Documents
 
# ย้อนกลับไปโฟลเดอร์ก่อนหน้า
cd ..
 
# ย้อนกลับ 2 ระดับ
cd ../..
 
# ไปที่ home directory
cd ~
cd
 
# ไปยัง directory ก่อนหน้า (สลับไปมา)
cd -
```
 
---
 
### `tree` — แสดงโครงสร้างโฟลเดอร์แบบ tree
 
```bash
# ติดตั้งก่อน (ถ้ายังไม่มี)
sudo apt install tree
 
# แสดงโครงสร้าง
tree
 
# จำกัดความลึก
tree -L 2
 
# แสดงขนาดไฟล์
tree -sh
```
 
**ตัวอย่างผลลัพธ์:**
```
.
├── Documents
│   ├── report.pdf
│   └── notes.txt
├── Downloads
│   └── ubuntu.iso
└── script.sh
```
 
---
 
## 2. การสร้างไฟล์และโฟลเดอร์
 
### `mkdir` — สร้างโฟลเดอร์
 
```bash
# สร้างโฟลเดอร์เดียว
mkdir my_folder
 
# สร้างหลายโฟลเดอร์พร้อมกัน
mkdir folder1 folder2 folder3
 
# สร้างโฟลเดอร์ซ้อนกัน (recursive)
mkdir -p projects/web/src
 
# สร้างพร้อมกำหนดสิทธิ์
mkdir -m 755 public_folder
```
 
---
 
### `touch` — สร้างไฟล์เปล่า
 
```bash
# สร้างไฟล์เปล่า
touch file.txt
 
# สร้างหลายไฟล์พร้อมกัน
touch file1.txt file2.txt file3.txt
 
# อัปเดต timestamp ของไฟล์ที่มีอยู่
touch existing_file.txt
```
 
---
 
### การสร้างไฟล์พร้อมเนื้อหา
 
```bash
# เขียนข้อความลงไฟล์ (ทับข้อมูลเดิม)
echo "Hello, World!" > file.txt
 
# เพิ่มข้อความต่อท้าย (ไม่ทับข้อมูลเดิม)
echo "Second line" >> file.txt
 
# เขียนหลายบรรทัดด้วย cat
cat > file.txt << EOF
บรรทัดที่ 1
บรรทัดที่ 2
บรรทัดที่ 3
EOF
```
 
---
 
## 3. การคัดลอกไฟล์และโฟลเดอร์
 
### `cp` — คัดลอกไฟล์
 
```bash
# คัดลอกไฟล์
cp file.txt file_backup.txt
 
# คัดลอกไปยังโฟลเดอร์อื่น
cp file.txt /home/username/Documents/
 
# คัดลอกและเปลี่ยนชื่อ
cp file.txt /home/username/Documents/new_name.txt
 
# คัดลอกโฟลเดอร์ทั้งหมด (recursive)
cp -r my_folder/ backup_folder/
 
# คัดลอกแบบ verbose (แสดงไฟล์ที่กำลังคัดลอก)
cp -rv my_folder/ backup_folder/
 
# คัดลอกเฉพาะเมื่อไฟล์ต้นทางใหม่กว่า
cp -u file.txt destination/
 
# คัดลอกแบบรักษา attributes (permission, timestamp)
cp -p file.txt destination/
cp -a my_folder/ backup_folder/
```
 
---
 
## 4. การย้ายและเปลี่ยนชื่อไฟล์
 
### `mv` — ย้ายหรือเปลี่ยนชื่อไฟล์
 
```bash
# เปลี่ยนชื่อไฟล์
mv old_name.txt new_name.txt
 
# ย้ายไฟล์ไปยังโฟลเดอร์อื่น
mv file.txt /home/username/Documents/
 
# ย้ายและเปลี่ยนชื่อพร้อมกัน
mv file.txt /home/username/Documents/new_name.txt
 
# ย้ายโฟลเดอร์
mv my_folder/ /home/username/Documents/
 
# ย้ายหลายไฟล์ไปยังโฟลเดอร์
mv file1.txt file2.txt file3.txt /destination/
 
# ถามยืนยันก่อนทับไฟล์ที่มีอยู่
mv -i file.txt destination/
 
# แสดงไฟล์ที่กำลังย้าย
mv -v file.txt destination/
```
 
---
 
## 5. การลบไฟล์และโฟลเดอร์
 
### `rm` — ลบไฟล์
 
```bash
# ลบไฟล์
rm file.txt
 
# ลบหลายไฟล์
rm file1.txt file2.txt file3.txt
 
# ลบโฟลเดอร์และเนื้อหาทั้งหมด (recursive)
rm -r my_folder/
 
# ลบโดยไม่ถามยืนยัน (force)
rm -f file.txt
 
# ลบโฟลเดอร์ทั้งหมดโดยไม่ถาม
rm -rf my_folder/
 
# แสดงไฟล์ที่กำลังลบ
rm -rv my_folder/
 
# ถามยืนยันทุกไฟล์
rm -i *.txt
```
 
:::danger ข้อควรระวัง
คำสั่ง `rm -rf` เป็นคำสั่งที่อันตรายมาก ไม่มีการยืนยัน และไม่สามารถกู้คืนได้ โดยเฉพาะ `rm -rf /` จะลบทุกอย่างในระบบ **ห้ามใช้โดยไม่แน่ใจ**
:::
 
### `rmdir` — ลบโฟลเดอร์เปล่า
 
```bash
# ลบโฟลเดอร์ที่ว่างเปล่าเท่านั้น
rmdir empty_folder
 
# ลบโฟลเดอร์ว่างแบบ recursive
rmdir -p projects/web/src
```
 
---
 
## 6. การค้นหาไฟล์
 
### `find` — ค้นหาไฟล์และโฟลเดอร์
 
```bash
# ค้นหาไฟล์ตามชื่อ
find /home -name "file.txt"
 
# ค้นหาแบบ case-insensitive
find /home -iname "file.txt"
 
# ค้นหาด้วย wildcard
find /home -name "*.txt"
 
# ค้นหาเฉพาะไฟล์ (ไม่รวมโฟลเดอร์)
find /home -type f -name "*.txt"
 
# ค้นหาเฉพาะโฟลเดอร์
find /home -type d -name "Documents"
 
# ค้นหาไฟล์ที่แก้ไขในช่วง 7 วันที่ผ่านมา
find /home -mtime -7
 
# ค้นหาไฟล์ขนาดใหญ่กว่า 100MB
find / -size +100M
 
# ค้นหาและลบไฟล์
find /tmp -name "*.tmp" -delete
 
# ค้นหาและรันคำสั่ง
find /home -name "*.txt" -exec ls -lh {} \;
```
 
---
 
### `locate` — ค้นหาไฟล์จาก database
 
```bash
# ติดตั้ง
sudo apt install mlocate
 
# อัปเดต database
sudo updatedb
 
# ค้นหาไฟล์
locate file.txt
 
# ค้นหาแบบ case-insensitive
locate -i file.txt
 
# จำกัดจำนวนผลลัพธ์
locate -n 10 "*.txt"
```
 
:::info หมายเหตุ
`locate` เร็วกว่า `find` มาก แต่ข้อมูลอาจไม่ทันสมัย ควรรัน `sudo updatedb` ก่อนใช้
:::
 
---
 
## 7. การดูเนื้อหาไฟล์
 
### `cat` — แสดงเนื้อหาไฟล์
 
```bash
# แสดงเนื้อหาทั้งหมด
cat file.txt
 
# แสดงพร้อมเลขบรรทัด
cat -n file.txt
 
# รวมหลายไฟล์
cat file1.txt file2.txt
 
# รวมไฟล์และบันทึกใหม่
cat file1.txt file2.txt > combined.txt
```
 
---
 
### `less` และ `more` — แสดงทีละหน้า
 
```bash
# แสดงทีละหน้า (แนะนำ)
less file.txt
 
# แสดงทีละหน้าแบบเก่า
more file.txt
```
 
**คีย์ควบคุม `less`:**
 
| ปุ่ม | การทำงาน |
|---|---|
| `Space` | เลื่อนหน้าถัดไป |
| `b` | เลื่อนหน้าก่อนหน้า |
| `↑ / ↓` | เลื่อนทีละบรรทัด |
| `/keyword` | ค้นหาข้อความ |
| `n` | ค้นหาถัดไป |
| `q` | ออกจากโปรแกรม |
 
---
 
### `head` และ `tail` — แสดงบางส่วนของไฟล์
 
```bash
# แสดง 10 บรรทัดแรก (default)
head file.txt
 
# แสดง 20 บรรทัดแรก
head -n 20 file.txt
 
# แสดง 10 บรรทัดสุดท้าย
tail file.txt
 
# แสดง 20 บรรทัดสุดท้าย
tail -n 20 file.txt
 
# ติดตามไฟล์แบบ real-time (เหมาะสำหรับ log)
tail -f /var/log/syslog
```
 
---
 
## 8. การจัดการ Link
 
### `ln` — สร้าง Link
 
```bash
# สร้าง Hard Link
ln original.txt hardlink.txt
 
# สร้าง Symbolic Link (Soft Link)
ln -s /path/to/original.txt symlink.txt
 
# สร้าง Symbolic Link สำหรับโฟลเดอร์
ln -s /path/to/folder/ folder_link
```
 
**ความแตกต่างระหว่าง Hard Link และ Symbolic Link:**
 
| | Hard Link | Symbolic Link |
|---|---|---|
| ชี้ไปที่ | inode ของไฟล์ | path ของไฟล์ |
| ใช้กับโฟลเดอร์ | ไม่ได้ | ได้ |
| ลบต้นทาง | ยังใช้ได้ | ใช้ไม่ได้ (broken link) |
| ข้าม filesystem | ไม่ได้ | ได้ |
 
---
 
## 9. การดูขนาดไฟล์และ Disk Usage
 
### `du` — ดูขนาดของไฟล์และโฟลเดอร์
 
```bash
# ดูขนาดโฟลเดอร์ปัจจุบัน
du -sh .
 
# ดูขนาดแต่ละโฟลเดอร์
du -sh */
 
# ดูขนาดทุกไฟล์และโฟลเดอร์
du -ah /home/username
 
# เรียงตามขนาด (ใหญ่ → เล็ก)
du -sh * | sort -rh
 
# ดู 10 โฟลเดอร์ที่ใหญ่ที่สุด
du -ah / 2>/dev/null | sort -rh | head -10
```
 
---
 
### `df` — ดูพื้นที่ว่างของ Disk
 
```bash
# แสดงพื้นที่ว่างทั้งหมด
df -h
 
# แสดงเฉพาะ filesystem ที่ระบุ
df -h /home
```
 
**ตัวอย่างผลลัพธ์:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   20G   28G  42% /
/dev/sda2       100G   60G   35G  63% /home
tmpfs           2.0G  1.2M  2.0G   1% /run
```
 
---
 
## 10. การบีบอัดและแตกไฟล์
 
### `tar` — จัดการไฟล์ archive
 
```bash
# บีบอัดโฟลเดอร์เป็น .tar.gz
tar -czvf archive.tar.gz my_folder/
 
# แตกไฟล์ .tar.gz
tar -xzvf archive.tar.gz
 
# แตกไปยังโฟลเดอร์ที่ระบุ
tar -xzvf archive.tar.gz -C /destination/
 
# ดูรายการไฟล์ใน archive
tar -tzvf archive.tar.gz
 
# บีบอัดแบบ .tar.bz2 (บีบอัดมากกว่า แต่ช้ากว่า)
tar -cjvf archive.tar.bz2 my_folder/
```
 
**ตัวช่วยจำ options ของ `tar`:**
 
| Option | ความหมาย |
|---|---|
| `c` | Create (สร้าง archive) |
| `x` | Extract (แตกไฟล์) |
| `t` | List (ดูรายการ) |
| `z` | ใช้ gzip (.gz) |
| `j` | ใช้ bzip2 (.bz2) |
| `v` | Verbose (แสดงชื่อไฟล์) |
| `f` | ระบุชื่อไฟล์ archive |
 
---
 
### `zip` / `unzip` — จัดการไฟล์ .zip
 
```bash
# ติดตั้ง
sudo apt install zip unzip
 
# บีบอัดไฟล์
zip archive.zip file1.txt file2.txt
 
# บีบอัดโฟลเดอร์
zip -r archive.zip my_folder/
 
# แตกไฟล์
unzip archive.zip
 
# แตกไปยังโฟลเดอร์ที่ระบุ
unzip archive.zip -d /destination/
 
# ดูรายการไฟล์ใน zip
unzip -l archive.zip
```
 
---
 
## 11. การกำหนดสิทธิ์ไฟล์
 
### `chmod` — เปลี่ยนสิทธิ์ไฟล์
 
**ระบบสิทธิ์ใน Linux:**
 
```
-rwxr-xr--
 |||||||+++-- Other (ผู้ใช้อื่น)
 ||||+++------ Group (กลุ่ม)
 |+++---------- Owner (เจ้าของ)
 +------------- ประเภท (- = file, d = directory)
```
 
**ค่าสิทธิ์:**
 
| สัญลักษณ์ | ค่า | ความหมาย |
|---|---|---|
| `r` | 4 | อ่านได้ |
| `w` | 2 | เขียนได้ |
| `x` | 1 | รันได้ (execute) |
| `-` | 0 | ไม่มีสิทธิ์ |
 
```bash
# กำหนดสิทธิ์แบบตัวเลข (Octal)
chmod 755 file.sh     # rwxr-xr-x
chmod 644 file.txt    # rw-r--r--
chmod 600 secret.txt  # rw-------
chmod 777 file.sh     # rwxrwxrwx (ทุกคนมีทุกสิทธิ์)
 
# กำหนดสิทธิ์แบบสัญลักษณ์
chmod u+x file.sh     # เพิ่มสิทธิ์รันให้ owner
chmod g-w file.txt    # ลบสิทธิ์เขียนของ group
chmod o+r file.txt    # เพิ่มสิทธิ์อ่านให้ other
chmod a+x file.sh     # เพิ่มสิทธิ์รันให้ทุกคน
 
# เปลี่ยนสิทธิ์แบบ recursive
chmod -R 755 my_folder/
```
 
---
 
### `chown` — เปลี่ยนเจ้าของไฟล์
 
```bash
# เปลี่ยนเจ้าของ
sudo chown username file.txt
 
# เปลี่ยนเจ้าของและกลุ่ม
sudo chown username:groupname file.txt
 
# เปลี่ยนแบบ recursive
sudo chown -R username:groupname my_folder/
```
 
---
 
## 12. Wildcard และ Pattern Matching
 
```bash
# * แทนทุกอักษร
ls *.txt          # ไฟล์ที่ลงท้ายด้วย .txt
ls file*          # ไฟล์ที่ขึ้นต้นด้วย file
rm *.log          # ลบทุกไฟล์ .log
 
# ? แทน 1 อักษร
ls file?.txt      # file1.txt, fileA.txt
 
# [...] แทนอักษรในวงเล็บ
ls file[123].txt  # file1.txt, file2.txt, file3.txt
ls file[a-z].txt  # filea.txt ถึง filez.txt
 
# {...} Brace expansion
mkdir {jan,feb,mar}_report
touch file{1..5}.txt   # สร้าง file1.txt ถึง file5.txt
```
 
---
 
## 13. การคัดลอก Path ของไฟล์และโฟลเดอร์
 
### วิธีที่ 1: ใช้คำสั่ง `pwd` (Path ของโฟลเดอร์ปัจจุบัน)
 
```bash
# แสดง path ของโฟลเดอร์ปัจจุบัน
pwd
 
# คัดลอก path ไปยัง clipboard โดยตรง
pwd | xclip -selection clipboard
 
# หรือใช้ xsel
pwd | xsel --clipboard --input
```
 
:::info ติดตั้ง xclip / xsel ก่อนใช้
```bash
sudo apt install xclip
# หรือ
sudo apt install xsel
```
:::
 
---
 
### วิธีที่ 2: ใช้คำสั่ง `realpath` (Path เต็มของไฟล์)
 
```bash
# แสดง absolute path ของไฟล์
realpath file.txt
 
# ผลลัพธ์
/home/username/Documents/file.txt
 
# คัดลอก path ไปยัง clipboard
realpath file.txt | xclip -selection clipboard
```
 
---
 
### วิธีที่ 3: ใช้คำสั่ง `readlink` (Path จริงของ Symbolic Link)
 
```bash
# แสดง path จริงของไฟล์หรือ symlink
readlink -f file.txt
 
# ผลลัพธ์
/home/username/Documents/file.txt
```
 
---
 
### วิธีที่ 4: ใช้ตัวแปร `$PWD` และ `$OLDPWD`
 
```bash
# แสดง path ปัจจุบัน
echo $PWD
 
# แสดง path ก่อนหน้า
echo $OLDPWD
 
# รวม path กับชื่อไฟล์
echo "$PWD/file.txt"
# ผลลัพธ์: /home/username/Documents/file.txt
 
# คัดลอกไปยัง clipboard
echo "$PWD/file.txt" | xclip -selection clipboard
```
 
---
 
### วิธีที่ 5: คัดลอก Path ผ่าน GUI (Files / Nautilus)
 
สำหรับผู้ใช้ Ubuntu Desktop ที่ใช้ File Manager (Nautilus):
 
1. เปิด **Files** (Nautilus)
2. นำทางไปยังไฟล์หรือโฟลเดอร์ที่ต้องการ
3. **คลิกขวา** ที่ไฟล์หรือโฟลเดอร์
4. เลือก **"Copy as Path"** หรือ **"คัดลอกเป็น Path"**
:::tip เคล็ดลับ
กด `Ctrl + L` ใน Nautilus เพื่อแสดง path bar แล้วสามารถคัดลอก path ได้เลย
:::
 
---
 
### วิธีที่ 6: Drag & Drop Path ใน Terminal
 
ใน Terminal บน Ubuntu Desktop สามารถ **ลากไฟล์จาก File Manager แล้ววางใน Terminal** ได้เลย ระบบจะแทรก path ของไฟล์นั้นโดยอัตโนมัติ
 
---
 
### วิธีที่ 7: สร้าง Alias สำหรับคัดลอก Path อย่างรวดเร็ว
 
```bash
# เพิ่มใน ~/.bashrc หรือ ~/.zshrc
alias copypath='realpath . | xclip -selection clipboard && echo "Path copied!"'
alias cpf='realpath "$1" | xclip -selection clipboard'
 
# โหลด config ใหม่
source ~/.bashrc
 
# ใช้งาน
copypath           # คัดลอก path โฟลเดอร์ปัจจุบัน
cpf file.txt       # คัดลอก path ของไฟล์ที่ระบุ
```
 
---
 
### สรุปวิธีคัดลอก Path
 
| วิธี | คำสั่ง / วิธีการ | เหมาะกับ |
|---|---|---|
| Path โฟลเดอร์ปัจจุบัน | `pwd \| xclip -selection clipboard` | คัดลอก path ที่อยู่ตอนนี้ |
| Path เต็มของไฟล์ | `realpath file.txt \| xclip -selection clipboard` | ระบุชื่อไฟล์ |
| Path จาก symlink | `readlink -f file.txt` | ไฟล์ที่เป็น symbolic link |
| GUI (Nautilus) | คลิกขวา → Copy as Path | ผู้ใช้ Desktop |
| Drag & Drop | ลากไฟล์วางใน Terminal | เร็วและสะดวก |
 
---
 
## 14. การค้นหาข้อความในไฟล์
 
### `grep` — ค้นหาข้อความในไฟล์
 
`grep` เป็นคำสั่งหลักสำหรับค้นหาข้อความภายในไฟล์ รองรับ Regular Expression ทำให้มีความยืดหยุ่นสูง
 
```bash
# ค้นหาข้อความในไฟล์
grep "hello" file.txt
 
# ค้นหาแบบ case-insensitive (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
grep -i "hello" file.txt
 
# แสดงเลขบรรทัดที่พบ
grep -n "hello" file.txt
 
# ค้นหาในหลายไฟล์
grep "hello" file1.txt file2.txt
 
# ค้นหาในทุกไฟล์ภายในโฟลเดอร์ (recursive)
grep -r "hello" /home/username/
 
# ค้นหาแบบ recursive + แสดงเลขบรรทัด
grep -rn "hello" /home/username/
 
# ค้นหาเฉพาะนามสกุลที่ระบุ
grep -r "hello" /home/username/ --include="*.txt"
 
# ค้นหาและแสดงเฉพาะชื่อไฟล์ที่พบ
grep -rl "hello" /home/username/
 
# ค้นหาแบบ invert (แสดงบรรทัดที่ไม่มีคำนั้น)
grep -v "hello" file.txt
 
# แสดงจำนวนบรรทัดที่พบ
grep -c "hello" file.txt
 
# แสดง N บรรทัดก่อนและหลังที่พบ
grep -A 3 "hello" file.txt   # 3 บรรทัดหลัง (After)
grep -B 3 "hello" file.txt   # 3 บรรทัดก่อน (Before)
grep -C 3 "hello" file.txt   # 3 บรรทัดทั้งสองด้าน (Context)
 
# ค้นหาคำเต็ม (whole word)
grep -w "hello" file.txt
 
# ค้นหาด้วย Regular Expression
grep -E "hello|world" file.txt     # หา hello หรือ world
grep -E "^hello" file.txt          # บรรทัดที่ขึ้นต้นด้วย hello
grep -E "hello$" file.txt          # บรรทัดที่ลงท้ายด้วย hello
grep -E "[0-9]+" file.txt          # บรรทัดที่มีตัวเลข
```
 
**ตัวอย่างผลลัพธ์ `grep -n "error" /var/log/syslog`:**
```
142:Jan 10 09:01:32 hostname kernel: error: device not found
256:Jan 10 09:05:10 hostname systemd: error starting service
```
 
---
 
### `grep` กับ Pipe
 
```bash
# ค้นหาจากผลลัพธ์ของคำสั่งอื่น
ls -la | grep ".txt"
 
# ค้นหา process ที่กำลังทำงาน
ps aux | grep "nginx"
 
# ค้นหาใน history คำสั่ง
history | grep "apt install"
 
# ค้นหาแบบซ้อนกัน
cat file.txt | grep "error" | grep -v "warning"
```
 
---
 
### `awk` — ค้นหาและประมวลผลข้อความ
 
`awk` เหมาะสำหรับการค้นหาและประมวลผลข้อมูลแบบคอลัมน์
 
```bash
# แสดงคอลัมน์ที่ 1 และ 3
awk '{print $1, $3}' file.txt
 
# ค้นหาบรรทัดที่มีคำที่ระบุ
awk '/hello/' file.txt
 
# ค้นหาและแสดงเฉพาะคอลัมน์ที่ต้องการ
awk '/error/ {print $1, $2}' /var/log/syslog
 
# กรองข้อมูลตามเงื่อนไข (คอลัมน์ที่ 3 มีค่ามากกว่า 100)
awk '$3 > 100' file.txt
 
# นับจำนวนบรรทัดที่ตรงเงื่อนไข
awk '/error/ {count++} END {print count}' file.txt
 
# ใช้ตัวคั่นแบบกำหนดเอง (เช่น CSV)
awk -F',' '{print $1, $2}' file.csv
```
 
---
 
### `sed` — ค้นหาและแทนที่ข้อความ
 
`sed` เหมาะสำหรับการค้นหาและแทนที่ข้อความใน stream
 
```bash
# แสดงบรรทัดที่มีคำที่ระบุ
sed -n '/hello/p' file.txt
 
# แทนที่คำแรกในแต่ละบรรทัด
sed 's/hello/world/' file.txt
 
# แทนที่ทุกคำในไฟล์ (global)
sed 's/hello/world/g' file.txt
 
# แทนที่แบบ case-insensitive
sed 's/hello/world/gi' file.txt
 
# แทนที่และบันทึกลงไฟล์เดิม
sed -i 's/hello/world/g' file.txt
 
# แทนที่และสำรองไฟล์เดิม
sed -i.bak 's/hello/world/g' file.txt
 
# ลบบรรทัดที่มีคำที่ระบุ
sed '/hello/d' file.txt
 
# แสดงเฉพาะบรรทัดที่ 5 ถึง 10
sed -n '5,10p' file.txt
```
 
---
 
### `wc` — นับจำนวนบรรทัด คำ และอักษร
 
```bash
# นับบรรทัด คำ และ bytes
wc file.txt
 
# นับเฉพาะบรรทัด
wc -l file.txt
 
# นับเฉพาะคำ
wc -w file.txt
 
# นับเฉพาะอักษร
wc -c file.txt
 
# นับบรรทัดจากผลลัพธ์ของคำสั่งอื่น
grep "error" /var/log/syslog | wc -l
```
 
---
 
### `sort` และ `uniq` — เรียงและกรองข้อมูล
 
```bash
# เรียงข้อความ
sort file.txt
 
# เรียงแบบย้อนกลับ
sort -r file.txt
 
# เรียงตามตัวเลข
sort -n file.txt
 
# ลบบรรทัดซ้ำ (ต้องเรียงก่อน)
sort file.txt | uniq
 
# แสดงเฉพาะบรรทัดที่ซ้ำ
sort file.txt | uniq -d
 
# นับจำนวนครั้งที่ซ้ำ
sort file.txt | uniq -c
 
# รวม sort + uniq เรียงตามจำนวน
sort file.txt | uniq -c | sort -rn
```
 
---
 
### `diff` — เปรียบเทียบความแตกต่างระหว่างไฟล์
 
```bash
# เปรียบเทียบสองไฟล์
diff file1.txt file2.txt
 
# แสดงผลแบบ side-by-side
diff -y file1.txt file2.txt
 
# แสดงแบบ unified format (นิยมใช้ใน git)
diff -u file1.txt file2.txt
 
# เปรียบเทียบสองโฟลเดอร์
diff -r folder1/ folder2/
```
 
**ความหมายของสัญลักษณ์ใน `diff`:**
 
| สัญลักษณ์ | ความหมาย |
|---|---|
| `<` | บรรทัดจากไฟล์แรก |
| `>` | บรรทัดจากไฟล์ที่สอง |
| `---` | ตัวคั่นระหว่างสองไฟล์ |
| `+` | บรรทัดที่เพิ่มเข้ามา (unified) |
| `-` | บรรทัดที่ถูกลบ (unified) |
 
---
 
### สรุปคำสั่งค้นหาข้อความ
 
| คำสั่ง | หน้าที่ |
|---|---|
| `grep "text" file` | ค้นหาข้อความในไฟล์ |
| `grep -rn "text" .` | ค้นหาในทุกไฟล์แบบ recursive |
| `grep -i "text" file` | ค้นหาแบบไม่สนตัวพิมพ์ |
| `grep -v "text" file` | แสดงบรรทัดที่ไม่มีคำนั้น |
| `awk '/text/'` | ค้นหาและประมวลผลคอลัมน์ |
| `sed 's/old/new/g'` | ค้นหาและแทนที่ข้อความ |
| `wc -l file` | นับจำนวนบรรทัด |
| `sort \| uniq -c` | นับและเรียงข้อมูลที่ซ้ำ |
| `diff file1 file2` | เปรียบเทียบสองไฟล์ |
 
 
 
| คำสั่ง | หน้าที่ |
|---|---|
| `ls -lh` | แสดงรายการไฟล์แบบละเอียด |
| `cd ~` | กลับ home directory |
| `mkdir -p` | สร้างโฟลเดอร์ซ้อนกัน |
| `cp -r` | คัดลอกโฟลเดอร์ทั้งหมด |
| `mv` | ย้าย/เปลี่ยนชื่อไฟล์ |
| `rm -rf` | ลบโฟลเดอร์ทั้งหมด (ระวัง!) |
| `find` | ค้นหาไฟล์ |
| `tar -czvf` | บีบอัดเป็น .tar.gz |
| `tar -xzvf` | แตกไฟล์ .tar.gz |
| `chmod 755` | กำหนดสิทธิ์ไฟล์ |
| `chown` | เปลี่ยนเจ้าของไฟล์ |
| `du -sh` | ดูขนาดโฟลเดอร์ |
| `df -h` | ดูพื้นที่ว่าง disk |