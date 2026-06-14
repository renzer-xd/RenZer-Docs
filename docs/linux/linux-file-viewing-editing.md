---
sidebar_position: 7
title: คู่มือการดูและแก้ไขไฟล์ข้อมูล
sidebar_label: 6. คู่มือการดูและแก้ไขไฟล์ข้อมูล
description: คู่มือการใช้งานคำสั่งและ Text Editor สำหรับดูและแก้ไขไฟล์บน Linux Ubuntu อย่างละเอียด ครอบคลุม cat, less, head, tail, nano, vim และเครื่องมือประมวลผลข้อความ
---

# คู่มือการดูและแก้ไขไฟล์ข้อมูล
 
การจัดการไฟล์ใน Linux ผ่าน Terminal เป็นทักษะพื้นฐานที่ขาดไม่ได้ ไม่ว่าจะเป็นการอ่าน Log, แก้ไข Config File หรือเขียน Script ทุกอย่างสามารถทำได้อย่างรวดเร็วโดยไม่ต้องเปิด GUI
 
---
 
## 1. การดูเนื้อหาไฟล์
 
### 1.1 คำสั่ง `cat` — แสดงเนื้อหาไฟล์ทั้งหมด
 
`cat` (Concatenate) ใช้แสดงเนื้อหาไฟล์แบบทีเดียวทั้งหมด เหมาะสำหรับไฟล์ขนาดเล็ก
 
```bash
# แสดงเนื้อหาไฟล์
cat filename.txt
 
# แสดงพร้อมเลขบรรทัด
cat -n filename.txt
 
# แสดงและทำให้เห็น Tab และ Whitespace
cat -A filename.txt
 
# รวมหลายไฟล์เป็นไฟล์เดียว
cat file1.txt file2.txt > combined.txt
 
# ต่อท้ายไฟล์ (Append)
cat file2.txt >> file1.txt
 
# สร้างไฟล์ใหม่พร้อมพิมพ์เนื้อหา (กด Ctrl+D เมื่อเสร็จ)
cat > newfile.txt
```
 
:::tip
สำหรับไฟล์ขนาดใหญ่ ไม่ควรใช้ `cat` เพราะจะแสดงทุกบรรทัดพร้อมกันจนเต็มหน้าจอ ให้ใช้ `less` แทน
:::
 
---
 
### 1.2 คำสั่ง `less` — อ่านไฟล์แบบ Scroll ได้
 
`less` เป็นเครื่องมือที่ดีที่สุดสำหรับอ่านไฟล์ขนาดใหญ่ เพราะโหลดเนื้อหาทีละส่วนโดยไม่ต้องอ่านทั้งไฟล์ก่อน ทำให้เปิดได้รวดเร็ว
 
```bash
# เปิดไฟล์ด้วย less
less filename.txt
 
# เปิดพร้อมแสดงเลขบรรทัด
less -N filename.txt
 
# เปิดหลายไฟล์พร้อมกัน (ใช้ :n และ :p เพื่อสลับ)
less file1.txt file2.txt
```
 
**Shortcut ภายใน `less`:**
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Space` / `f` | เลื่อนหน้าถัดไป |
| `b` | เลื่อนกลับหน้าก่อน |
| `↑` / `↓` | เลื่อนทีละบรรทัด |
| `g` | ไปยังบรรทัดแรก |
| `G` | ไปยังบรรทัดสุดท้าย |
| `/คำค้นหา` | ค้นหาข้างหน้า |
| `?คำค้นหา` | ค้นหาข้างหลัง |
| `n` | ไปผลการค้นหาถัดไป |
| `N` | ไปผลการค้นหาก่อนหน้า |
| `F` | ติดตามการเปลี่ยนแปลงแบบ Real-time (คล้าย `tail -f`) |
| `v` | เปิดไฟล์ใน Vim เพื่อแก้ไข |
| `q` | ออกจากโปรแกรม |
 
---
 
### 1.3 คำสั่ง `head` — ดูบรรทัดแรกของไฟล์
 
```bash
# ดู 10 บรรทัดแรก (ค่า Default)
head filename.txt
 
# ดู 20 บรรทัดแรก
head -n 20 filename.txt
 
# ดูหลายไฟล์พร้อมกัน
head -n 5 file1.txt file2.txt
 
# ดูทุกบรรทัด ยกเว้น 5 บรรทัดสุดท้าย
head -n -5 filename.txt
```
 
---
 
### 1.4 คำสั่ง `tail` — ดูบรรทัดท้ายของไฟล์
 
```bash
# ดู 10 บรรทัดสุดท้าย (ค่า Default)
tail filename.txt
 
# ดู 30 บรรทัดสุดท้าย
tail -n 30 filename.txt
 
# ติดตาม Log แบบ Real-time (กด Ctrl+C เพื่อหยุด)
tail -f /var/log/syslog
 
# ติดตามหลายไฟล์พร้อมกัน
tail -f /var/log/nginx/access.log /var/log/nginx/error.log
 
# ดูตั้งแต่บรรทัดที่ 50 เป็นต้นไป
tail -n +50 filename.txt
```
 
:::tip 
เทคนิค
ใช้ `tail -f` ร่วมกับ `grep` เพื่อกรอง Log แบบ Real-time:
 
```bash
tail -f /var/log/auth.log | grep "Failed password"
```
:::
 
---
 
### 1.5 คำสั่ง `more` — อ่านไฟล์ทีละหน้า (แบบเก่า)
 
`more` ทำงานคล้าย `less` แต่เลื่อนกลับไม่ได้ ในงานจริงนิยมใช้ `less` มากกว่า
 
```bash
more filename.txt
```
 
---
 
### 1.6 คำสั่งอื่น ๆ สำหรับดูไฟล์
 
```bash
# แสดงพร้อมเลขบรรทัด (คล้าย cat -n แต่สวยกว่า)
nl filename.txt
 
# ดูไฟล์แบบ Hex + ASCII (เหมาะสำหรับไฟล์ Binary)
hexdump -C binaryfile.bin
 
# ดูข้อมูลไฟล์ตั้งแต่ Offset ที่กำหนด
xxd filename.bin | head -20
 
# ดูประเภทของไฟล์
file filename.txt
file /bin/ls
```
 
---
 
## 2. การแก้ไขไฟล์ด้วย `nano` (เหมาะสำหรับผู้เริ่มต้น)
 
`nano` เป็น Text Editor ที่ใช้งานง่าย มีเมนูคำสั่งแสดงอยู่ที่ด้านล่างหน้าจอตลอดเวลา เหมาะสำหรับการแก้ไข Config File อย่างรวดเร็ว
 
```bash
# เปิดหรือสร้างไฟล์ใหม่
nano filename.txt
 
# เปิดไฟล์และไปยังบรรทัดที่กำหนด
nano +50 filename.txt
 
# เปิดแบบ Read-only
nano -v filename.txt
 
# เปิดพร้อมแสดงเลขบรรทัด
nano -l filename.txt
```
 
### Shortcut ทั้งหมดใน `nano`
 
:::info สัญลักษณ์
- `^` หมายถึงปุ่ม **Ctrl** (เช่น `^O` = `Ctrl + O`)
- `M-` หมายถึงปุ่ม **Alt** (เช่น `M-U` = `Alt + U`)
:::
#### เปิด / บันทึก / ออก
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Ctrl + O` | บันทึกไฟล์ (Write Out) |
| `Ctrl + X` | ออกจาก nano (ถามบันทึกถ้ามีการเปลี่ยนแปลง) |
| `Ctrl + R` | เปิดไฟล์อื่นเข้ามาใน Buffer ปัจจุบัน (Insert File) |
| `Ctrl + G` | เปิดหน้า Help (แสดง Shortcut ทั้งหมด) |
 
#### การเคลื่อนที่ (Navigation)
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `←` `→` `↑` `↓` | เคลื่อนที่ทีละตัวอักษร / บรรทัด |
| `Ctrl + F` | เคลื่อนที่ไปข้างหน้า 1 ตัวอักษร |
| `Ctrl + B` | เคลื่อนที่ถอยหลัง 1 ตัวอักษร |
| `Ctrl + Space` | ข้ามไปคำถัดไป |
| `Alt + Space` | ข้ามไปคำก่อนหน้า |
| `Ctrl + A` | ไปต้นบรรทัด |
| `Ctrl + E` | ไปท้ายบรรทัด |
| `Ctrl + P` | ขึ้นบรรทัดก่อนหน้า |
| `Ctrl + N` | ลงบรรทัดถัดไป |
| `Ctrl + V` | เลื่อนหน้าถัดไป (Page Down) |
| `Ctrl + Y` | เลื่อนหน้าก่อนหน้า (Page Up) |
| `Alt + \` | ไปบรรทัดแรกของไฟล์ |
| `Alt + /` | ไปบรรทัดสุดท้ายของไฟล์ |
| `Ctrl + _` | ไปยังบรรทัดและคอลัมน์ที่กำหนด |
| `Ctrl + C` | แสดงตำแหน่ง Cursor ปัจจุบัน (บรรทัด, คอลัมน์) |
 
#### ค้นหาและแทนที่
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Ctrl + W` | ค้นหาข้อความ |
| `Alt + W` | ไปผลการค้นหาถัดไป |
| `Alt + Q` | ไปผลการค้นหาก่อนหน้า |
| `Ctrl + \` | ค้นหาและแทนที่ (Find & Replace) |
 
:::tip
ขณะอยู่ในโหมดค้นหา (`Ctrl+W`) กด `Alt+R` เพื่อเปิดใช้ Regular Expression และกด `Alt+C` เพื่อตัดสิน Case-sensitive
:::
 
#### ตัด / คัดลอก / วาง
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Alt + A` | ตั้ง Mark (เริ่มเลือกข้อความ) |
| `Alt + 6` | คัดลอกบรรทัด / ข้อความที่เลือก (Copy) |
| `Ctrl + K` | ตัดบรรทัด / ข้อความที่เลือก (Cut) |
| `Ctrl + U` | วางข้อความ (Paste/Uncut) |
| `Ctrl + 6` | ยกเลิกการเลือก |
 
:::tip
กด `Ctrl+K` หลาย ๆ ครั้งติดกัน = ตัดหลายบรรทัดพร้อมกัน แล้วค่อย `Ctrl+U` เพื่อวางทีเดียว
:::
 
#### Undo / Redo
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Alt + U` | Undo |
| `Alt + E` | Redo |
 
#### การแสดงผลและ UI
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Alt + X` | ซ่อน / แสดง Shortcut Bar ด้านล่าง |
| `Alt + N` | เปิด / ปิดเลขบรรทัด |
| `Alt + P` | เปิด / ปิดการแสดง Whitespace |
| `Alt + Z` | เปิด / ปิด Soft-wrap (ตัดบรรทัดอัตโนมัติ) |
| `Ctrl + L` | Refresh / วาดหน้าจอใหม่ |
 
#### Buffer และหลายไฟล์
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Alt + <` | สลับไป Buffer ก่อนหน้า |
| `Alt + >` | สลับไป Buffer ถัดไป |
 
#### อื่น ๆ
 
| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `Ctrl + T` | เรียก Spell Checker (ถ้ามี `spell` ติดตั้งอยู่) |
| `Ctrl + J` | จัด Paragraph ให้เป็นระเบียบ (Justify) |
| `Alt + J` | จัด Justify ทั้งไฟล์ |
| `Tab` | เยื้องบรรทัด (Indent) |
| `Alt + }` | Indent ข้อความที่เลือก |
| `Alt + {` | Unindent ข้อความที่เลือก |
 
---
 
## 3. การแก้ไขไฟล์ด้วย `vim` (สำหรับผู้ใช้ขั้นสูง)
 
`vim` (Vi IMproved) เป็น Text Editor ทรงพลังที่พบได้ในทุก Linux Server มี Learning Curve สูง แต่เมื่อชำนาญแล้วจะทำงานได้รวดเร็วมาก
 
```bash
# ติดตั้ง vim (หากยังไม่มี)
sudo apt install vim
 
# เปิดไฟล์
vim filename.txt
 
# เปิดและไปบรรทัดที่กำหนด
vim +50 filename.txt
 
# เปิดไฟล์หลายไฟล์
vim file1.txt file2.txt
```
 
### 3.1 โหมดต่าง ๆ ใน Vim
 
Vim มี 4 โหมดหลักที่ต้องเข้าใจก่อนใช้งาน:
 
```
┌─────────────────────────────────────────────┐
│                 NORMAL MODE                  │
│           (โหมดเริ่มต้น / Navigation)        │
│                                             │
│   i, a, o → INSERT    v, V, Ctrl+V → VISUAL │
│       : → COMMAND                            │
└─────────────────────────────────────────────┘
```
 
| โหมด | วิธีเข้า | การใช้งาน |
|------|---------|----------|
| **Normal** | `Esc` (โหมดเริ่มต้น) | Navigation, Copy, Paste, Delete |
| **Insert** | `i`, `a`, `o` | พิมพ์และแก้ไขข้อความ |
| **Visual** | `v`, `V`, `Ctrl+V` | เลือกข้อความ |
| **Command** | `:` | บันทึก, ออก, ค้นหา, แทนที่ |
 
---
 
### 3.2 การเปิด บันทึก และออก
 
```vim
:w              " บันทึกไฟล์
:w filename.txt " บันทึกเป็นชื่อใหม่
:q              " ออก (ถ้าไม่มีการเปลี่ยนแปลง)
:wq             " บันทึกและออก
:q!             " ออกโดยไม่บันทึก
ZZ              " บันทึกและออก (Normal Mode)
ZQ              " ออกโดยไม่บันทึก (Normal Mode)
```
 
---
 
### 3.3 การเคลื่อนที่ใน Normal Mode
 
```vim
" เคลื่อนที่พื้นฐาน
h  j  k  l      " ซ้าย ลง ขึ้น ขวา (แทนลูกศร)
 
" เคลื่อนที่ตามคำ
w               " ไปคำถัดไป (ข้ามช่องว่าง)
b               " ไปคำก่อนหน้า
e               " ไปท้ายคำปัจจุบัน
 
" เคลื่อนที่ตามบรรทัด
0               " ไปต้นบรรทัด
^               " ไปตัวแรกของบรรทัด (ไม่นับช่องว่าง)
$               " ไปท้ายบรรทัด
 
" เคลื่อนที่ทั้งไฟล์
gg              " ไปบรรทัดแรก
G               " ไปบรรทัดสุดท้าย
50G             " ไปบรรทัดที่ 50
Ctrl+f          " เลื่อนหน้าถัดไป
Ctrl+b          " เลื่อนหน้าก่อนหน้า
```
 
---
 
### 3.4 การพิมพ์และแก้ไข (Insert Mode)
 
```vim
i               " Insert ก่อน Cursor
a               " Append หลัง Cursor
I               " Insert ต้นบรรทัด
A               " Append ท้ายบรรทัด
o               " เปิดบรรทัดใหม่ด้านล่าง
O               " เปิดบรรทัดใหม่ด้านบน
```
 
---
 
### 3.5 การลบและแก้ไข
 
```vim
x               " ลบตัวอักษรที่ Cursor
dd              " ลบทั้งบรรทัด
5dd             " ลบ 5 บรรทัด
dw              " ลบจาก Cursor ถึงท้ายคำ
d$              " ลบจาก Cursor ถึงท้ายบรรทัด
dG              " ลบจาก Cursor ถึงท้ายไฟล์
 
r               " แทนที่ตัวอักษรเดียว
cw              " เปลี่ยนจาก Cursor ถึงท้ายคำ (เข้า Insert Mode)
cc              " เปลี่ยนทั้งบรรทัด (เข้า Insert Mode)
ciw             " เปลี่ยนคำที่ Cursor อยู่
```
 
---
 
### 3.6 Copy, Cut และ Paste
 
```vim
yy              " Copy (Yank) บรรทัดปัจจุบัน
5yy             " Copy 5 บรรทัด
yw              " Copy จาก Cursor ถึงท้ายคำ
y$              " Copy จาก Cursor ถึงท้ายบรรทัด
 
p               " Paste หลัง Cursor / บรรทัดถัดไป
P               " Paste ก่อน Cursor / บรรทัดก่อนหน้า
```
 
---
 
### 3.7 Undo และ Redo
 
```vim
u               " Undo
Ctrl+r          " Redo
.               " ทำซ้ำคำสั่งล่าสุด (มีประโยชน์มาก)
```
 
---
 
### 3.8 การค้นหาและแทนที่
 
```vim
/pattern        " ค้นหาข้างหน้า
?pattern        " ค้นหาข้างหลัง
n               " ไปผลถัดไป
N               " ไปผลก่อนหน้า
*               " ค้นหาคำที่ Cursor อยู่ (ข้างหน้า)
 
" แทนที่ข้อความ (Command Mode)
:s/old/new/     " แทนที่ครั้งแรกในบรรทัดปัจจุบัน
:s/old/new/g    " แทนที่ทุก Instance ในบรรทัดปัจจุบัน
:%s/old/new/g   " แทนที่ทั้งไฟล์
:%s/old/new/gc  " แทนที่ทั้งไฟล์พร้อมถามยืนยันทุกครั้ง
:10,20s/old/new/g " แทนที่เฉพาะบรรทัด 10-20
```
 
---
 
### 3.9 Visual Mode — เลือกข้อความ
 
```vim
v               " เลือกทีละตัวอักษร
V               " เลือกทีละบรรทัด
Ctrl+v          " เลือกแบบ Block (สี่เหลี่ยม)
 
" หลังจากเลือกแล้ว:
d               " ลบ
y               " Copy
c               " เปลี่ยน (เข้า Insert Mode)
>               " Indent
<               " Unindent
```
 
---
 
### 3.10 คำสั่ง Vim ที่มีประโยชน์
 
```vim
:set number     " แสดงเลขบรรทัด
:set nonumber   " ซ่อนเลขบรรทัด
:set hlsearch   " Highlight ผลการค้นหา
:nohlsearch     " ล้าง Highlight
:set syntax=python  " กำหนด Syntax Highlighting
 
" เปิดหลายไฟล์
:e filename.txt " เปิดไฟล์อื่น
:n              " ไปไฟล์ถัดไป (ถ้าเปิดหลายไฟล์)
:split file.txt " แบ่งหน้าจอแนวนอน
:vsplit file.txt " แบ่งหน้าจอแนวตั้ง
Ctrl+w Ctrl+w   " สลับระหว่าง Window
```
 
---
 
## 4. การประมวลผลข้อความด้วย `grep`, `sed`, `awk`
 
### 4.1 `grep` — ค้นหาข้อความ
 
`grep` ใช้ค้นหาบรรทัดที่ตรงกับ Pattern ใน Option ไฟล์หรือ Output
 
```bash
# ค้นหาพื้นฐาน
grep "error" logfile.txt
 
# ค้นหาโดยไม่สนตัวพิมพ์ใหญ่เล็ก
grep -i "error" logfile.txt
 
# แสดงบรรทัดที่ไม่ตรง Pattern
grep -v "error" logfile.txt
 
# แสดงเลขบรรทัดที่พบ
grep -n "error" logfile.txt
 
# ค้นหาแบบ Recursive ในโฟลเดอร์
grep -r "config" /etc/
 
# ค้นหาพร้อมแสดงบรรทัดบริบท (3 บรรทัดก่อน-หลัง)
grep -C 3 "error" logfile.txt
 
# ค้นหาด้วย Regular Expression
grep -E "error|warning|critical" logfile.txt
 
# นับจำนวนบรรทัดที่พบ
grep -c "error" logfile.txt
 
# ค้นหาเฉพาะคำเต็ม (ไม่รวม substring)
grep -w "fail" logfile.txt
 
# ค้นหาในหลายไฟล์และแสดงชื่อไฟล์
grep -l "TODO" *.py
```
 
**ตัวอย่างการใช้งานจริง:**
 
```bash
# หา IP ที่ Login ผิดพลาด
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
 
# หาบรรทัด Error ใน Log วันนี้
grep "$(date '+%b %d')" /var/log/syslog | grep -i error
```
 
---
 
### 4.2 `sed` — แก้ไขข้อความแบบ Stream
 
`sed` (Stream Editor) ใช้ค้นหาและแทนที่ข้อความ ลบบรรทัด หรือแปลงข้อมูลโดยไม่ต้องเปิด Editor
 
```bash
# แทนที่ครั้งแรกในแต่ละบรรทัด
sed 's/old/new/' filename.txt
 
# แทนที่ทุก Instance ในทุกบรรทัด
sed 's/old/new/g' filename.txt
 
# แก้ไขไฟล์ตรง ๆ (In-place)
sed -i 's/old/new/g' filename.txt
 
# สร้าง Backup ก่อนแก้ไข
sed -i.bak 's/old/new/g' filename.txt
 
# ลบบรรทัดที่ตรง Pattern
sed '/^#/d' filename.txt       # ลบบรรทัดที่ขึ้นต้นด้วย #
sed '/^$/d' filename.txt       # ลบบรรทัดว่าง
 
# แสดงเฉพาะบรรทัดที่กำหนด
sed -n '10,20p' filename.txt   # แสดงบรรทัด 10-20
 
# แทนที่ในบรรทัดที่กำหนด
sed '5s/old/new/' filename.txt
 
# ใช้ Delimiter อื่น (มีประโยชน์เมื่อข้อความมี /)
sed 's#/home/user#/home/newuser#g' paths.txt
```
 
**ตัวอย่างการใช้งานจริง:**
 
```bash
# เปลี่ยน Domain ใน Config File
sed -i 's/old-domain.com/new-domain.com/g' /etc/nginx/sites-available/default
 
# ลบ Comment และบรรทัดว่างออกจากไฟล์ Config
sed '/^#/d; /^$/d' /etc/nginx/nginx.conf
 
# เพิ่มข้อความหน้าทุกบรรทัด
sed 's/^/  /' filename.txt
```
 
---
 
### 4.3 `awk` — ประมวลผลข้อมูลแบบคอลัมน์
 
`awk` เหมาะสำหรับข้อมูลที่มีโครงสร้างแบบตาราง เช่น Log File หรือ CSV โดยอ้างอิงคอลัมน์ด้วย `$1`, `$2`, ...
 
```bash
# แสดงคอลัมน์ที่ 1 และ 3
awk '{print $1, $3}' filename.txt
 
# ใช้ Delimiter อื่น (เช่น : ใน /etc/passwd)
awk -F: '{print $1}' /etc/passwd
 
# กรองเฉพาะบรรทัดที่คอลัมน์ 3 มากกว่า 100
awk '$3 > 100' filename.txt
 
# คำนวณผลรวมคอลัมน์
awk '{sum += $2} END {print "Total:", sum}' filename.txt
 
# แสดงบรรทัดที่ตรง Pattern เฉพาะคอลัมน์
awk '/error/ {print $0}' logfile.txt
 
# แสดงจำนวนบรรทัดและคอลัมน์
awk 'END {print NR, "lines"}' filename.txt
 
# Format Output
awk '{printf "%-10s %5d\n", $1, $2}' data.txt
```
 
**ตัวอย่างการใช้งานจริง:**
 
```bash
# ดู Disk Usage เฉพาะ Partition ที่ใช้เกิน 80%
df -h | awk 'NR>1 && $5+0 > 80 {print $0}'
 
# ดู Username ทั้งหมดจาก /etc/passwd
awk -F: '$3 >= 1000 {print $1}' /etc/passwd
 
# สรุปขนาดไฟล์ในโฟลเดอร์
ls -l | awk 'NR>1 {sum += $5} END {print "Total:", sum/1024, "KB"}'
```
 
---
 
### 4.4 เปรียบเทียบ `grep`, `sed`, `awk`
 
| เครื่องมือ | จุดเด่น | เหมาะใช้เมื่อ |
|-----------|---------|-------------|
| `grep` | เร็วที่สุด เรียบง่าย | ค้นหาบรรทัดที่ตรง Pattern |
| `sed` | แก้ไขข้อความ In-place | Find & Replace, ลบบรรทัด |
| `awk` | ประมวลผลข้อมูลตาราง | คำนวณ, ดึงคอลัมน์, Format Output |
 
---
 
## 5. คำสั่งเพิ่มเติมสำหรับจัดการข้อความ
 
### `sort` — เรียงลำดับ
 
```bash
# เรียงตามตัวอักษร
sort filename.txt
 
# เรียงแบบกลับด้าน
sort -r filename.txt
 
# เรียงตามตัวเลข
sort -n numbers.txt
 
# เรียงตามคอลัมน์ที่ 2
sort -k2 filename.txt
 
# เรียงและลบซ้ำ
sort -u filename.txt
```
 
### `uniq` — จัดการบรรทัดซ้ำ
 
```bash
# ลบบรรทัดซ้ำ (ต้อง sort ก่อน)
sort filename.txt | uniq
 
# นับจำนวนครั้งที่ซ้ำ
sort filename.txt | uniq -c
 
# แสดงเฉพาะบรรทัดที่ซ้ำ
sort filename.txt | uniq -d
 
# แสดงเฉพาะบรรทัดที่ไม่ซ้ำ
sort filename.txt | uniq -u
```
 
### `cut` — ตัดข้อมูลตาม Field
 
```bash
# ตัดคอลัมน์ที่ 1 โดยใช้ : เป็น Delimiter
cut -d: -f1 /etc/passwd
 
# ตัดหลายคอลัมน์
cut -d: -f1,3 /etc/passwd
 
# ตัดตามตำแหน่งตัวอักษร (ตัวที่ 1-10)
cut -c1-10 filename.txt
```
 
### `wc` — นับจำนวน
 
```bash
# นับบรรทัด, คำ, และตัวอักษร
wc filename.txt
 
# นับเฉพาะบรรทัด
wc -l filename.txt
 
# นับเฉพาะคำ
wc -w filename.txt
```
 
### `diff` — เปรียบเทียบไฟล์
 
```bash
# เปรียบเทียบสองไฟล์
diff file1.txt file2.txt
 
# เปรียบเทียบแบบ Side-by-side
diff -y file1.txt file2.txt
 
# แสดงเฉพาะส่วนที่แตกต่าง
diff -u file1.txt file2.txt
```
 
---
 
## 6. เทคนิคการใช้งาน Pipe
 
การใช้ `|` (Pipe) ต่อคำสั่งหลาย ๆ ตัวเข้าด้วยกันคือหัวใจของการทำงานบน Linux Terminal
 
```bash
# ดู Error ใน Log วันนี้ เรียงตามเวลา
cat /var/log/syslog | grep "error" | sort | tail -20
 
# หา 10 IP ที่เข้ามาบ่อยที่สุดจาก Access Log
cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
 
# ดูโปรเซสที่กินหน่วยความจำมากสุด แสดงเฉพาะ Process Name และ %MEM
ps aux | sort -k4 -rn | head -10 | awk '{print $11, $4"%"}'
 
# ค้นหาไฟล์ .conf ที่มีข้อความ "port" และแสดงพร้อมเลขบรรทัด
grep -rn "port" /etc/*.conf 2>/dev/null
 
# นับจำนวน Error แต่ละประเภทใน Log
grep -oE "ERROR|WARNING|CRITICAL" /var/log/syslog | sort | uniq -c
```
 
---
 
## 7. สรุป — เลือกเครื่องมือให้เหมาะกับงาน
 
| งาน | เครื่องมือที่แนะนำ |
|----|-----------------|
| ดูไฟล์เล็ก ๆ | `cat` |
| อ่านไฟล์ขนาดใหญ่ | `less` |
| ดู Log แบบ Real-time | `tail -f` |
| ดูส่วนต้น / ส่วนท้ายของไฟล์ | `head` / `tail` |
| แก้ไขไฟล์แบบรวดเร็ว (มือใหม่) | `nano` |
| แก้ไขไฟล์ขั้นสูง / เขียน Script | `vim` |
| ค้นหาข้อความในไฟล์ | `grep` |
| Find & Replace แบบ Batch | `sed` |
| ประมวลผลข้อมูลตาราง / คอลัมน์ | `awk` |
| เปรียบเทียบไฟล์ | `diff` |