---
sidebar_position: 6
title: คู่มือการตรวจสอบทรัพยากรและโปรเซสระบบ
sidebar_label: 5. การตรวจสอบทรัพยากรและโปรเซสระบบ
description: คู่มือการใช้งานคำสั่งและเครื่องมือสำหรับตรวจสอบทรัพยากรและจัดการโปรเซสบน Linux Ubuntu อย่างละเอียด
---

# คู่มือการตรวจสอบทรัพยากรและโปรเซสระบบ

การตรวจสอบทรัพยากรระบบ (System Resource Monitoring) เป็นทักษะพื้นฐานที่สำคัญสำหรับผู้ดูแลระบบ Linux ช่วยให้สามารถวินิจฉัยปัญหา ป้องกัน Bottleneck และดูแลระบบให้ทำงานได้อย่างมีประสิทธิภาพ

---

## 1. ภาพรวมทรัพยากรระบบ

### 1.1 ตรวจสอบข้อมูล CPU

```bash
# ดูข้อมูล CPU ทั้งหมด
lscpu

# ดูจำนวน Core และ Thread
nproc

# ดูการใช้งาน CPU แบบ Real-time (กด q เพื่อออก)
top
```

**ตัวอย่างผลลัพธ์จาก `lscpu`:**

```
Architecture:          x86_64
CPU(s):                8
Thread(s) per core:    2
Core(s) per socket:    4
Model name:            Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz
```

### 1.2 ตรวจสอบหน่วยความจำ (RAM)

```bash
# ดูหน่วยความจำในรูปแบบที่อ่านง่าย
free -h

# ดูรายละเอียดเพิ่มเติม
cat /proc/meminfo
```

**ตัวอย่างผลลัพธ์จาก `free -h`:**

```
              total        used        free      shared  buff/cache   available
Mem:           15Gi       4.2Gi       7.1Gi       512Mi       4.0Gi       10Gi
Swap:         2.0Gi       0.0Ki       2.0Gi
```

| ฟิลด์ | ความหมาย |
|-------|----------|
| `total` | RAM ทั้งหมด |
| `used` | RAM ที่ใช้งานอยู่ |
| `free` | RAM ที่ว่างอยู่จริง |
| `buff/cache` | RAM ที่ใช้เป็น Buffer/Cache (คืนได้) |
| `available` | RAM ที่สามารถใช้ได้จริง |

### 1.3 ตรวจสอบ Disk

```bash
# ดูพื้นที่ Disk ทุก Partition
df -h

# ดูการใช้พื้นที่ในโฟลเดอร์ปัจจุบัน
du -sh *

# ดูพื้นที่โฟลเดอร์ที่กำหนด (เรียงจากมากไปน้อย)
du -sh /var/* | sort -rh | head -10
```

### 1.4 ตรวจสอบ Network

```bash
# ดูสถิติ Network Interface
ip -s link

# ดู IP Address
ip addr show

# ดูตาราง Routing
ip route
```

---

## 2. คำสั่ง `top` — ตรวจสอบ Real-time แบบพื้นฐาน

`top` เป็นคำสั่งที่ติดมากับระบบ Linux ทุกเวอร์ชัน ใช้ดูโปรเซสและทรัพยากรแบบ Real-time

```bash
top
```

### Shortcut ที่ควรรู้ภายใน `top`

| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `P` | เรียงตาม CPU usage |
| `M` | เรียงตาม Memory usage |
| `N` | เรียงตาม PID |
| `k` | Kill โปรเซส (กรอก PID) |
| `r` | Renice โปรเซส |
| `1` | แสดง CPU แต่ละ Core แยกกัน |
| `q` | ออกจากโปรแกรม |

### ใช้แบบ Batch Mode (สำหรับ Script)

```bash
# แสดงผลครั้งเดียวโดยไม่ต้องเปิด Interactive
top -b -n 1

# แสดงเฉพาะ 5 โปรเซสแรก
top -b -n 1 | head -17
```

---

## 3. คำสั่ง `ps` — ดูโปรเซสแบบ Snapshot

`ps` ใช้แสดงรายการโปรเซสที่กำลังทำงานอยู่ ณ ขณะนั้น

```bash
# ดูโปรเซสทั้งหมดในระบบ (รูปแบบที่นิยมใช้)
ps aux

# ดูโปรเซสในรูปแบบ Full Format
ps -ef

# ดูโปรเซสแบบ Tree (แสดงความสัมพันธ์ Parent-Child)
ps auxf

# ค้นหาโปรเซสตามชื่อ
ps aux | grep nginx
```

### อ่านผลลัพธ์ `ps aux`

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 168484 11244 ?        Ss   08:00   0:01 /sbin/init
www-data  1234  0.5  1.2 512000 98304 ?        S    09:15   0:30 nginx: worker
```

| คอลัมน์ | ความหมาย |
|---------|---------|
| `USER` | ผู้ใช้ที่รันโปรเซส |
| `PID` | Process ID |
| `%CPU` | เปอร์เซ็นต์การใช้ CPU |
| `%MEM` | เปอร์เซ็นต์การใช้ RAM |
| `VSZ` | Virtual Memory ที่ใช้ (KB) |
| `RSS` | RAM จริงที่ใช้ (KB) |
| `STAT` | สถานะโปรเซส |
| `TIME` | CPU time ที่ใช้ไปทั้งหมด |

### สถานะโปรเซส (STAT)

| สถานะ | ความหมาย |
|-------|---------|
| `R` | Running — กำลังทำงาน |
| `S` | Sleeping — รอ Event |
| `D` | Uninterruptible Sleep — รอ I/O |
| `T` | Stopped — หยุดชั่วคราว |
| `Z` | Zombie — โปรเซสที่ตายแล้วแต่ยังค้างอยู่ |

### ค้นหาโปรเซสด้วย `pgrep`

```bash
# หา PID ของโปรเซสตามชื่อ
pgrep nginx

# หาพร้อมแสดงชื่อ
pgrep -la nginx

# หาโดยใช้ Pattern แบบเต็ม
pgrep -f "python manage.py"
```

---

## 4. การจัดการโปรเซส

### 4.1 คำสั่ง `kill` — ส่ง Signal ไปยังโปรเซส

```bash
# ส่ง SIGTERM (15) — ขอให้โปรเซสหยุดอย่างสุภาพ (ค่า Default)
kill 1234
kill -15 1234
kill -SIGTERM 1234

# ส่ง SIGKILL (9) — บังคับหยุดทันที (ใช้เมื่อ SIGTERM ไม่ได้ผล)
kill -9 1234
kill -SIGKILL 1234

# ส่ง SIGHUP (1) — ให้โปรเซส Reload Configuration
kill -1 1234
kill -SIGHUP 1234
```

:::warning ข้อควรระวัง
ควรลอง `kill` (SIGTERM) ก่อนเสมอ และใช้ `kill -9` (SIGKILL) เป็นทางเลือกสุดท้าย เพราะ SIGKILL บังคับหยุดทันทีโดยไม่ให้โปรเซสทำความสะอาดข้อมูล
:::

### Signal ที่ใช้บ่อย

| Signal | หมายเลข | ความหมาย |
|--------|---------|---------|
| `SIGTERM` | 15 | ขอหยุดอย่างสุภาพ |
| `SIGKILL` | 9 | บังคับหยุดทันที |
| `SIGHUP` | 1 | Reload / Restart |
| `SIGSTOP` | 19 | หยุดชั่วคราว |
| `SIGCONT` | 18 | ทำงานต่อ |

```bash
# ดู Signal ทั้งหมดที่มี
kill -l
```

### 4.2 คำสั่ง `pkill` และ `killall` — Kill ตามชื่อ

```bash
# Kill โปรเซสตามชื่อ (ใช้ Pattern)
pkill firefox

# Force kill ทุก Instance ของโปรแกรม
pkill -9 chrome

# Kill โดยระบุชื่อแน่นอน (ต้องตรงทั้งหมด)
killall nginx

# Kill ทุกโปรเซสของผู้ใช้คนหนึ่ง
pkill -u username
```

:::caution
`pkill` และ `killall` จะส่งผลกับทุกโปรเซสที่ตรงกับ Pattern ควรตรวจสอบให้ดีก่อนใช้
:::

### 4.3 การควบคุม Background/Foreground Jobs

```bash
# รันโปรแกรมใน Background
command &

# ดูรายการ Jobs ที่รันอยู่
jobs

# นำ Job กลับมา Foreground
fg %1

# ส่ง Job ไปทำงาน Background
bg %1

# หยุด Job ชั่วคราว (กด Ctrl+Z)
# แล้วส่งไป Background
bg

# รันโปรแกรมโดยไม่หยุดแม้ปิด Terminal
nohup command &
```

---

## 5. การจัดการ Priority ของโปรเซส

Linux กำหนด Priority ด้วย **Nice Value** ตั้งแต่ `-20` (Priority สูงสุด) ถึง `19` (Priority ต่ำสุด) ค่า Default คือ `0`

### 5.1 คำสั่ง `nice` — กำหนด Priority ตอนเริ่มรัน

```bash
# รันด้วย Priority ต่ำ (ใช้ CPU น้อยลง เหมาะกับงาน Backup)
nice -n 10 tar czf backup.tar.gz /data

# รันด้วย Priority สูง (ต้องใช้ sudo)
sudo nice -n -5 /opt/critical-service/run.sh
```

### 5.2 คำสั่ง `renice` — เปลี่ยน Priority โปรเซสที่กำลังรันอยู่

```bash
# ลด Priority ของโปรเซส PID 4321
renice -n 10 -p 4321

# เพิ่ม Priority (ต้องใช้ sudo)
sudo renice -n -5 -p 4321

# เปลี่ยน Priority ทุกโปรเซสของผู้ใช้
renice 10 -u username

# ดู Nice Value ของโปรเซสทั้งหมด
ps -eo pid,ni,comm
```

:::info
ผู้ใช้ทั่วไปสามารถเพิ่ม Nice Value (ลด Priority) ได้เท่านั้น การลด Nice Value (เพิ่ม Priority) ต้องใช้ `sudo`
:::

---

## 6. การตรวจสอบ I/O และ Disk Activity

### 6.1 คำสั่ง `iostat`

```bash
# ติดตั้ง sysstat ก่อน
sudo apt install sysstat

# ดูสถิติ CPU และ Disk I/O
iostat

# แสดงผลทุก 2 วินาที
iostat 2

# แสดงเฉพาะ Disk พร้อม Human-readable
iostat -h -d 2
```

### 6.2 คำสั่ง `vmstat`

```bash
# ดูภาพรวม Memory, Swap, CPU, I/O
vmstat

# แสดงผลทุก 1 วินาที จำนวน 5 ครั้ง
vmstat 1 5
```

**ฟิลด์สำคัญใน `vmstat`:**

| ฟิลด์ | ความหมาย |
|-------|---------|
| `r` | จำนวนโปรเซสที่รอ CPU |
| `b` | จำนวนโปรเซสที่รอ I/O |
| `si` | Swap In (KB/s) |
| `so` | Swap Out (KB/s) |
| `bi` | Blocks รับเข้าจาก Disk |
| `bo` | Blocks ส่งออกไป Disk |
| `wa` | เปอร์เซ็นต์ CPU ที่รอ I/O |

---

## 7. การดู Log ระบบ

```bash
# ดู System Log แบบ Real-time
journalctl -f

# ดู Log พร้อมแสดง Error ล่าสุด
journalctl -xe

# ดู Log ย้อนหลัง 1 ชั่วโมง
journalctl --since "1 hour ago"

# ดู Log ของ Service เฉพาะ
journalctl -u nginx.service

# ดู Kernel Log
dmesg | tail -50
```

---

## 8. แพ็กเกจที่แนะนำ

### 8.1 `htop` — Interactive Process Viewer

`htop` เป็นตัวแทนที่ดีกว่าของ `top` มี Interface สีสันสวยงาม รองรับ Mouse และจัดการโปรเซสได้ง่าย

```bash
# ติดตั้ง
sudo apt install htop

# เปิดใช้งาน
htop
```

**Shortcut ภายใน `htop`:**

| ปุ่ม | ฟังก์ชัน |
|------|---------|
| `F2` | เข้าเมนู Setup ปรับแต่ง |
| `F5` | เปิด Tree View (แสดงความสัมพันธ์โปรเซส) |
| `F6` | เลือกคอลัมน์ที่ต้องการ Sort |
| `F9` | Kill โปรเซส (เลือก Signal ได้) |
| `u` | Filter โปรเซสตาม User |
| `/` | ค้นหาโปรเซส |

---

### 8.2 `glances` — Dashboard ครบวงจร

`glances` รวมข้อมูล CPU, Memory, Disk, Network และโปรเซสไว้ในหน้าจอเดียว รองรับการเข้าถึงผ่าน Web Browser ด้วย

```bash
# ติดตั้ง
sudo apt install glances

# เปิดใช้งาน
glances

# เปิดเป็น Web Server (เข้าผ่าน http://localhost:61208)
glances -w

# ตั้งรหัสผ่านสำหรับ Web Interface
glances -w --password

# ปิด Plugin ที่ไม่ต้องการ (เช่น Docker)
glances --disable-plugin docker
```

**ตัวอย่างการใช้ Glances Web Interface:**

เมื่อรัน `glances -w` แล้วเปิด Browser ที่ `http://IP_ADDRESS:61208` จะเห็น Dashboard แสดงข้อมูลทรัพยากรทั้งหมด เหมาะสำหรับการ Monitor Server จากระยะไกล

---

### 8.3 `btop` — Modern Resource Monitor

`btop` เป็นเครื่องมือ Monitor รุ่นใหม่ มี UI สวยงามทันสมัย รองรับ Mouse และปรับแต่งได้หลากหลาย

```bash
# ติดตั้ง
sudo apt install btop

# เปิดใช้งาน
btop
```

---

### 8.4 `atop` — Historical System Monitor

`atop` บันทึกข้อมูลระบบตลอดเวลา สามารถย้อนกลับมาดูข้อมูลในอดีตได้ เหมาะสำหรับวิเคราะห์ปัญหาที่เกิดขึ้นแล้ว

```bash
# ติดตั้ง
sudo apt install atop

# เปิดใช้งาน Real-time
atop

# ดูข้อมูลย้อนหลัง (จากไฟล์ที่บันทึกไว้อัตโนมัติ)
atop -r /var/log/atop/atop_YYYYMMDD
```

---

### 8.5 `nload` — Network Traffic Monitor

`nload` แสดงการใช้ Bandwidth ของ Network Interface แบบ Real-time พร้อม Graph

```bash
# ติดตั้ง
sudo apt install nload

# เปิดใช้งาน
nload

# ดู Interface เฉพาะ
nload eth0
```

---

### 8.6 `sysstat` — ชุดเครื่องมือ Performance

`sysstat` รวม `iostat`, `sar`, `mpstat` และเครื่องมืออื่นๆ สำหรับเก็บข้อมูล Performance แบบละเอียด

```bash
# ติดตั้ง
sudo apt install sysstat

# ดูสถิติ CPU ทุก 5 วินาที จำนวน 3 ครั้ง
sar -u 5 3

# ดูสถิติ Memory
sar -r

# ดูสถิติ Network
sar -n DEV 1 5

# ดูข้อมูลย้อนหลังจากวันที่ 22
sar -f /var/log/sysstat/sa22
```

---

### 8.7 `lsof` — ดู Open Files และ Network Connections

`lsof` (List Open Files) ใช้ดูว่าโปรเซสไหนเปิดไฟล์หรือ Port ใดอยู่

```bash
# ดูไฟล์ที่โปรเซส PID นั้นเปิดอยู่
lsof -p 1234

# ดูว่าโปรแกรมไหนใช้ Port 8080
lsof -i :8080

# ดูไฟล์ที่ User นั้นเปิดอยู่
lsof -u alice

# ดู Network Connections ทั้งหมด
lsof -i
```

---

## 9. เทคนิคและคำสั่งขั้นสูง

### ค้นหาและ Kill โปรเซสที่กิน CPU เยอะ

```bash
# ดู 5 โปรเซสที่กิน CPU มากที่สุด
ps aux --sort=-%cpu | head -6

# Kill โปรเซสที่ใช้ CPU เกิน 80%
ps aux | awk '$3 > 80.0 {print $2}' | xargs kill -TERM
```

### ดูข้อมูลโปรเซสจาก `/proc`

```bash
# ดูข้อมูล Status ของโปรเซส
cat /proc/1234/status

# ดู Command ที่ใช้รันโปรเซส
cat /proc/1234/cmdline | tr '\0' ' '

# ดู Memory Map
cat /proc/1234/maps

# ดู OOM Score (ค่าสูง = โอกาสถูก Kill เยอะเมื่อ RAM เต็ม)
cat /proc/1234/oom_score
```

### Monitor แบบต่อเนื่องด้วย `watch`

```bash
# รันคำสั่งซ้ำทุก 2 วินาที
watch df -h

# รันทุก 1 วินาที พร้อม Highlight การเปลี่ยนแปลง
watch -n 1 -d free -h
```

---

## 10. สรุป — เลือกเครื่องมือให้เหมาะกับงาน

| สถานการณ์ | เครื่องมือที่แนะนำ |
|----------|-----------------|
| ตรวจสอบด่วน (ไม่ต้องติดตั้งเพิ่ม) | `top`, `ps`, `free`, `df` |
| Interactive Monitor ที่ใช้งานง่าย | `htop` |
| Dashboard ครบวงจร / Monitor ผ่าน Web | `glances` |
| UI สวยงาม ทันสมัย | `btop` |
| วิเคราะห์ปัญหาในอดีต | `atop`, `sar` |
| ตรวจสอบ Network Traffic | `nload` |
| ดู Port และไฟล์ที่เปิดอยู่ | `lsof` |
| เก็บสถิติ Performance ระยะยาว | `sysstat` (sar, iostat) |