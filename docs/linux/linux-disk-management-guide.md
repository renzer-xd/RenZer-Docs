---
sidebar_position: 11
title: คู่มือการจัดการ Disk อย่างละเอียด
sidebar_label: 11. การจัดการ Disk
description: คู่มือการจัดการ Disk บน Linux Ubuntu รวมถึงดู Disk partition fdisk parted เพิ่ม Disk ใหม่ mount Disk ที่มีข้อมูล LVM file system management
---

# คู่มือการจัดการ Disk อย่างละเอียด

การจัดการ Disk คือการทำงานที่สำคัญมากสำหรับ System Administrator เพราะต้องจัดการพื้นที่จัดเก็บข้อมูลอย่างมีประสิทธิภาพ ปลอดภัย และยืดหยุ่น

---

## 1. ดูและตรวจสอบ Disk ปัจจุบัน

### 1.1 ดูรายการ Disk ทั้งหมด

```bash
# ดูรายการ Disk แบบ Tree (แนะนำ)
lsblk

# ดูรายละเอียด (รวม UUID, FSTYPE)
lsblk -f

# หรือ
lsblk -o NAME,SIZE,FSTYPE,LABEL,UUID,MOUNTPOINT
```

**ตัวอย่างผลลัพธ์:**

```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0  500G  0 disk
├─sda1   8:1    0    1G  0 part /boot
└─sda2   8:2    0  499G  0 part /
sdb      8:16   0    1T  0 disk
└─sdb1   8:17   0    1T  0 part /data
```

### 1.2 ดู Partition Table

```bash
# ดูด้วย fdisk (Legacy)
sudo fdisk -l

# ดูด้วย parted (Modern)
sudo parted -l

# ดูเฉพาะ Disk เดียว
sudo parted /dev/sdb print
```

### 1.3 ดู Disk Space Usage

```bash
# ดู Disk Space ทั้งหมด (สำคัญ)
df -h

# ดู Inode Usage
df -i

# ดูขนาดของ Directory
du -sh /home/*
du -sh /var/*

# หา 10 Directory ที่ใหญ่ที่สุด
du -sh /home/* | sort -rh | head -10
```

### 1.4 ดู Disk Information

```bash
# ดูข้อมูล Disk ทั้งหมด (รวม UUID)
sudo blkid

# ดูของ Disk เดียว
sudo blkid /dev/sdb1

# ดูข้อมูล I/O Statistics
iostat -x
```

---

## 2. การเพิ่ม Disk ใหม่

### 2.1 ขั้นตอนโดยรวม

```
1. เชื่อมต่อ Physical Disk หรือ Add Virtual Disk ใน Hypervisor
   ↓
2. ตรวจสอบว่า Linux รู้จัก Disk ใหม่
   ↓
3. สร้าง Partition (ถ้าต้อง)
   ↓
4. สร้าง File System
   ↓
5. Mount Disk
   ↓
6. เพิ่มลงใน /etc/fstab เพื่อ Auto Mount
```

### 2.2 ตรวจสอบ Disk ใหม่

```bash
# ดู Disk ใหม่ที่เชื่อมต่อมา
lsblk

# หรือ
dmesg | tail -20   # ดู Kernel Message
```

**หากไม่ปรากฏให้ลองค้นหาใหม่:**

```bash
# Rescan SCSI Bus (สำหรับ Physical Disk)
sudo echo "- - -" > /sys/class/scsi_host/host0/scan

# หรือสำหรับ NVMe
sudo nvme scan
```

### 2.3 สร้าง Partition (ใช้ parted)

```bash
# ดาวน์โหลด parted (ถ้ายังไม่มี)
sudo apt install parted -y

# สร้าง GPT Partition Table (สมัยใหม่ - แนะนำ)
sudo parted /dev/sdb mklabel gpt

# สร้าง Partition เต็มทั้ง Disk
sudo parted /dev/sdb mkpart primary ext4 0% 100%

# ตรวจสอบ
sudo parted /dev/sdb print

# หรือใช้ fdisk (สำหรับ MBR)
sudo fdisk /dev/sdb
# ใส่คำสั่ง: n (new) → p (primary) → 1 → Enter → Enter → w (write)
```

:::tip
- **GPT** (GUID Partition Table) — Modern, supports >2TB, แนะนำใช้
- **MBR** (Master Boot Record) — Legacy, max 2TB per partition
:::

### 2.4 สร้าง File System

```bash
# สำหรับ Partition /dev/sdb1
# ext4 (Most common)
sudo mkfs.ext4 /dev/sdb1

# XFS (High performance)
sudo mkfs.xfs /dev/sdb1

# Btrfs (Copy-on-write, snapshots)
sudo mkfs.btrfs /dev/sdb1

# ตรวจสอบ
sudo blkid /dev/sdb1
```

### 2.5 Mount Disk (ชั่วคราว)

```bash
# สร้าง Mount Point
sudo mkdir -p /mnt/newdisk

# Mount
sudo mount /dev/sdb1 /mnt/newdisk

# ตรวจสอบ
mount | grep /mnt/newdisk
df -h /mnt/newdisk
```

### 2.6 Mount Disk ถาวร (ใน /etc/fstab)

```bash
# หา UUID ของ Partition
sudo blkid /dev/sdb1

# Output: /dev/sdb1: UUID="abc123..." TYPE="ext4"

# Backup /etc/fstab ก่อน
sudo cp /etc/fstab /etc/fstab.bak

# แก้ไข /etc/fstab
sudo nano /etc/fstab

# เพิ่มบรรทัด:
# UUID=abc123... /mnt/newdisk ext4 defaults,nofail 0 2
```

**ตัวอย่าง fstab entry:**

```
# Device                                Mount Point    FS Type  Options              Dump  FSCK
UUID=a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d  /mnt/newdisk   ext4     defaults,nofail      0     2
```

**อธิบายแต่ละฟิลด์:**

| ฟิลด์ | ความหมาย | ตัวอย่าง |
|-------|---------|---------|
| Device | UUID หรือ Device Path | UUID=... หรือ /dev/sdb1 |
| Mount Point | ที่ต้องการ Mount | /mnt/newdisk |
| FS Type | ประเภท File System | ext4, xfs, btrfs |
| Options | Mount Options | defaults, nofail, ro, rw |
| Dump | สำหรับ Backup (0=skip) | 0 หรือ 1 |
| FSCK Order | ลำดับ File System Check | 0 (skip) หรือ 2 |

**Mount Options ที่สำคัญ:**

| Option | ความหมาย |
|--------|---------|
| `defaults` | rw,suid,dev,exec,auto,nouser,async |
| `nofail` | ไม่สำคัญถ้า Mount ล้มเหลว (ไม่ Boot crash) |
| `ro` | Read-Only |
| `rw` | Read-Write |
| `sync` | Write ทันที (ช้าแต่ปลอดภัย) |
| `async` | Write เมื่อเสร็จสิ้น (เร็วกว่า) |
| `noatime` | ไม่ Update Access Time (เร็วขึ้น) |

### 2.7 ทดสอบและใช้ fstab ใหม่

```bash
# ตรวจสอบ fstab ว่าสำคัญถูก
sudo mount -a

# ดู Error ถ้ามี
sudo systemctl status systemd-remount-fs

# ตรวจสอบการ Mount
mount | grep /mnt/newdisk
df -h /mnt/newdisk

# ทดสอบการ Reboot
sudo reboot

# หลังจาก Reboot ตรวจสอบ
df -h /mnt/newdisk
```

---

## 3. การ Mount Disk ที่มีข้อมูลอยู่แล้ว

### 3.1 สถานการณ์ทั่วไป

**Disk เก่า ยังมีข้อมูล** → ต้อง Mount โดยไม่สูญเสียข้อมูล

```bash
# 1. เชื่อมต่อ Disk เก่า (ผ่าน USB, SATA cable เป็นต้น)

# 2. ตรวจสอบ Disk
lsblk -f

# 3. ตรวจสอบ File System (ไม่ต้องสร้างใหม่!)
sudo blkid

# 4. สร้าง Mount Point
sudo mkdir -p /mnt/olddata

# 5. Mount โดยตรง (ไม่ต้องสร้าง Partition หรือ File System)
sudo mount /dev/sdb1 /mnt/olddata

# 6. ตรวจสอบข้อมูล
ls -la /mnt/olddata
```

### 3.2 Mount โดยใช้ UUID (แนะนำ)

```bash
# ดู UUID ของ Disk
sudo blkid | grep sdb

# Output: /dev/sdb1: UUID="xyz789..." TYPE="ext4" LABEL="OldData"

# Mount ชั่วคราวเพื่อทดสอบ
sudo mount UUID=xyz789... /mnt/olddata

# ตรวจสอบ
df -h /mnt/olddata
ls -la /mnt/olddata

# ถ้าสำเร็จ เพิ่มลงใน fstab
sudo nano /etc/fstab
# เพิ่ม: UUID=xyz789... /mnt/olddata ext4 defaults,nofail 0 2

# Reload fstab
sudo mount -a
```

### 3.3 แก้ไขสิทธิ์ (Permissions)

บางครั้งไฟล์อาจ Owned โดย User ID เก่า:

```bash
# ดูเจ้าของไฟล์
ls -la /mnt/olddata

# เปลี่ยนเจ้าของเป็น Current User
sudo chown -R $USER:$USER /mnt/olddata

# หรือให้ Everyone อ่านได้
sudo chmod -R 755 /mnt/olddata
```

### 3.4 Unmount Disk

```bash
# Unmount ชั่วคราว
sudo umount /mnt/olddata

# ตรวจสอบ
mount | grep olddata  # ไม่ควรปรากฏ

# ถ้าไม่ Unmount ได้ (File ที่ใช้อยู่)
lsof /mnt/olddata     # ดูว่า Process ไหนใช้อยู่
sudo fuser -km /mnt/olddata  # Force Kill

# ถ้าต้องการลบออกจาก fstab ก็แค่ลบบรรทัด
sudo nano /etc/fstab
```

---

## 4. File System Management

### 4.1 ตรวจสอบ File System

```bash
# ตรวจสอบ ext4 (ต้อง Unmount ก่อน)
sudo umount /mnt/newdisk
sudo fsck -f /dev/sdb1

# ตรวจสอบ XFS (ต่อ Live ได้)
sudo xfs_repair -n /dev/sdb1  # ทดสอบเท่านั้น
sudo xfs_repair /dev/sdb1     # Fix แบบจริง
```

### 4.2 Resize File System

```bash
# ขยาย ext4 (ต้อง Mounted)
sudo resize2fs /dev/sdb1

# ขยาย XFS (ต้อง Mounted)
sudo xfs_growfs /mnt/newdisk

# ดูผลลัพธ์
df -h /mnt/newdisk
```

### 4.3 Defragment

```bash
# ext4 ไม่ต้อง Defrag (Modern File System)

# Btrfs Defragment
sudo btrfs filesystem defragment -r /mnt/newdisk
```

---

## 5. Disk Cleanup และ Space Recovery

### 5.1 หาไฟล์ที่ใหญ่

```bash
# หา 10 ไฟล์ที่ใหญ่ที่สุด
find / -type f -exec ls -lh {} \; 2>/dev/null | sort -k5 -hr | head -10

# หา Log ที่ใหญ่
find /var/log -type f -exec ls -lh {} \; | sort -k5 -hr | head -10
```

### 5.2 ลบไฟล์ที่ไม่ต้อง

```bash
# ลบ Old Log
sudo rm /var/log/*.gz
sudo rm /var/log/*.[0-9]

# ลบ Package Cache
sudo apt clean
sudo apt autoclean

# ลบ Temporary Files
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*

# ลบ Swap Space ที่ไม่ใช้ (ถ้าต้อง)
sudo swapoff -a
sudo swapon -a
```

### 5.3 Compress Log Files

```bash
# Compress old log files
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;

# ตั้ง Log Rotation ชั่วคราว
sudo nano /etc/logrotate.d/rsyslog
# เปลี่ยน 'rotate 4' เป็น 'rotate 1'
```

---

## 6. Advanced: LVM (Logical Volume Management)

LVM ให้ความยืดหยุ่นมากขึ้น เช่น Resize ขณะใช้งาน

### 6.1 ส่วนประกอบของ LVM

```
Physical Volume (PV)      ← แท้งจริง /dev/sdb1
    ↓ (grouped by)
Volume Group (VG)         ← ชื่อ vg_storage
    ↓ (divided into)
Logical Volume (LV)       ← /dev/vg_storage/data
```

### 6.2 สร้าง LVM

```bash
# 1. สร้าง Physical Volume
sudo pvcreate /dev/sdb1

# 2. สร้าง Volume Group
sudo vgcreate vg_storage /dev/sdb1

# 3. สร้าง Logical Volume (100GB)
sudo lvcreate -L 100G -n storage /dev/vg_storage

# 4. สร้าง File System
sudo mkfs.ext4 /dev/vg_storage/storage

# 5. Mount
sudo mkdir -p /mnt/lvm_storage
sudo mount /dev/vg_storage/storage /mnt/lvm_storage
```

### 6.3 ขยาย LVM (ไม่ต้อง Unmount)

```bash
# ขยาย Logical Volume เพิ่ม 50GB
sudo lvextend -L +50G /dev/vg_storage/storage

# ขยาย File System
sudo resize2fs /dev/vg_storage/storage

# ตรวจสอบ
df -h /mnt/lvm_storage
```

### 6.4 ดู LVM Information

```bash
# ดู Physical Volumes
sudo pvs
sudo pvdisplay

# ดู Volume Groups
sudo vgs
sudo vgdisplay

# ดู Logical Volumes
sudo lvs
sudo lvdisplay
```

---

## 7. RAID (Redundant Array of Independent Disks)

RAID รวม Disk หลายลูกเพื่อ Reliability หรือ Performance

### 7.1 RAID Types

| RAID | ลักษณะ | ข้อดี | ข้อเสีย |
|------|--------|------|--------|
| 0 | Striping (ไม่มี Redundancy) | เร็วสุด | ถ้า Disk 1 ลูก เสีย = สูญเสียทั้งหมด |
| 1 | Mirroring | ปลอดภัย (Copy เต็ม) | ต้อง Disk 2 ลูก, Space 50% |
| 5 | Striping + Parity | ปลอดภัย + เร็ว | ต้อง Min 3 Disk |
| 6 | Dual Parity | ปลอดภัยสุด | Slower, ต้อง Min 4 Disk |
| 10 | Mirrored Stripe | ดีที่สุด | ต้อง Min 4 Disk |

### 7.2 สร้าง RAID 1 (ตัวอย่าง)

```bash
# ติดตั้ง mdadm
sudo apt install mdadm -y

# สร้าง RAID 1 จาก 2 Disk
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# สร้าง File System
sudo mkfs.ext4 /dev/md0

# Mount
sudo mkdir -p /mnt/raid1
sudo mount /dev/md0 /mnt/raid1

# บันทึก Configuration
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

---

## 8. สรุปคำสั่งสำคัญ

| งาน | คำสั่ง |
|-----|--------|
| ดู Disk ทั้งหมด | `lsblk -f` |
| ดู Disk Space | `df -h` |
| ดู UUID | `sudo blkid` |
| สร้าง Partition | `sudo parted /dev/sdb mklabel gpt` → `mkpart primary ext4 0% 100%` |
| สร้าง File System | `sudo mkfs.ext4 /dev/sdb1` |
| Mount ชั่วคราว | `sudo mount /dev/sdb1 /mnt/newdisk` |
| Mount ถาวร | แก้ `/etc/fstab` + `sudo mount -a` |
| ขยาย File System | `sudo resize2fs /dev/sdb1` (ext4) |
| ตรวจสอบ File System | `sudo fsck -f /dev/sdb1` |
| หา Large Files | `find / -type f -exec ls -lh {} \; \| sort -k5 -hr \| head -10` |
| Clean Up Disk | `sudo apt clean` + `sudo apt autoclean` |
| สร้าง LVM | `sudo pvcreate`, `sudo vgcreate`, `sudo lvcreate` |
| ขยาย LVM | `sudo lvextend -L +50G /dev/vg/lv` |
| ดู RAID Status | `sudo mdadm --detail /dev/md0` |