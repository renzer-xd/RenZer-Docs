---
sidebar_position: 7
title: คู่มือการตั้งค่าและตรวจเช็คเครือข่าย
sidebar_label: 7. คู่มือการตั้งค่าและตรวจเช็คเครือข่าย
description: คู่มือการใช้งาน Network Configuration, DNS, Firewall และการแก้ไขปัญหาเครือข่ายบน Linux Ubuntu อย่างละเอียด ครอบคลุม Netplan, ip, ping, traceroute, UFW
---

# คู่มือการตั้งค่าและตรวจเช็คเครือข่าย
 
การตั้งค่าและจัดการเครือข่าย (Network Configuration) เป็นทักษะสำคัญสำหรับผู้ดูแล Linux Server ซึ่งครอบคลุมตั้งแต่การกำหนด IP Address, DNS, Firewall จนถึงการแก้ไขปัญหาการเชื่อมต่อเครือข่าย
 
---
 
## 1. ดูข้อมูลเครือข่ายปัจจุบัน
 
### 1.1 ตรวจสอบ Network Interface
 
```bash
# ดูข้อมูลทั้งหมด (แนะนำ - modern command)
ip link show
 
# หรือแสดง IP Address พร้อม Interface
ip addr show
 
# ดูเฉพาะ Interface ที่ Active
ip link show up
 
# ดู Interface ชื่อ enp0s3
ip addr show enp0s3
 
# Legacy command (ค่อนข้างเก่า แต่ยังใช้ได้)
ifconfig -a
```
 
**ผลลัพธ์ที่ต้องรู้:**
 
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
 
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::1234:5678:90ab:cdef/64 scope link
```
 
| ฟิลด์ | ความหมาย |
|-------|----------|
| `lo` | Loopback (127.0.0.1) — ใช้ได้ทันทีเสมอ |
| `eth0`, `enp0s3` | Ethernet Interface ของ Network Card |
| `UP` | Interface เปิดอยู่ |
| `DOWN` | Interface ปิดอยู่ |
| `inet 192.168.1.100/24` | IPv4 Address และ Subnet Mask |
| `inet6` | IPv6 Address |
 
### 1.2 ตรวจสอบ IP Address และ Gateway
 
```bash
# ดู IP Address ทั้งหมด
ip addr
 
# ดู Routing Table (Default Gateway)
ip route
 
# ดูรายละเอียด
ip route show
 
# หรือใช้ legacy command
route -n
```
 
**ตัวอย่างผลลัพธ์ `ip route`:**
 
```
default via 192.168.1.1 dev eth0 proto kernel scope global
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100
```
 
| ส่วน | ความหมาย |
|-----|----------|
| `default via 192.168.1.1` | Default Gateway (เส้นทางปกติไปอินเทอร์เน็ต) |
| `dev eth0` | Interface ที่ใช้ |
| `192.168.1.0/24` | Network ที่เชื่อมต่ออยู่ |
 
### 1.3 ตรวจสอบ DNS Server
 
```bash
# ดู DNS Configuration
cat /etc/resolv.conf
 
# ดู DNS ของ Interface เฉพาะ (Netplan)
cat /etc/resolv.conf
```
 
**ตัวอย่างผลลัพธ์:**
 
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```
 
---
 
## 2. การตั้งค่า IP Address ชั่วคราว (Temporary)
 
ตั้งค่าแบบนี้จะหายเมื่อ Reboot มักใช้สำหรับการ Test
 
### 2.1 เปิด/ปิด Interface
 
```bash
# เปิด Interface
sudo ip link set eth0 up
 
# ปิด Interface
sudo ip link set eth0 down
 
# หรือใช้ ifconfig (Legacy)
sudo ifconfig eth0 up
sudo ifconfig eth0 down
```
 
### 2.2 กำหนด IP Address ชั่วคราว
 
```bash
# กำหนด IP Address ด้วย Subnet Mask
sudo ip addr add 192.168.1.100/24 dev eth0
 
# เอา IP Address ออก
sudo ip addr del 192.168.1.100/24 dev eth0
 
# ล้างเสียหมด (ลบ IP ทั้งหมด)
sudo ip addr flush dev eth0
 
# Legacy command
sudo ifconfig eth0 192.168.1.100 netmask 255.255.255.0
```
 
### 2.3 กำหนด Default Gateway ชั่วคราว
 
```bash
# เพิ่ม Default Gateway
sudo ip route add default via 192.168.1.1 dev eth0
 
# ล้าง Default Gateway
sudo ip route del default via 192.168.1.1
 
# ดู Gateway ปัจจุบัน
ip route | grep default
```
 
### 2.4 เพิ่ม Extra IP ชั่วคราว
 
```bash
# เพิ่ม Secondary IP Address
sudo ip addr add 192.168.1.101/24 dev eth0
 
# เพิ่มหลาย IP พร้อมกัน
sudo ip addr add 192.168.1.102/24 dev eth0
sudo ip addr add 192.168.1.103/24 dev eth0
 
# เพิ่ม IP ต่างเน็ตเวิร์ก
sudo ip addr add 10.0.0.50/24 dev eth0
 
# ดู IP ทั้งหมด
ip addr show eth0
 
# ลบ Extra IP
sudo ip addr del 192.168.1.101/24 dev eth0
 
# ล้าง IP ทั้งหมดใน Interface
sudo ip addr flush dev eth0
 
# ตั้ง Alias IP (Legacy Method - ยังใช้ได้)
sudo ip link add link eth0 name eth0:1 type alias
sudo ip addr add 192.168.1.104/24 dev eth0:1
sudo ip link set eth0:1 up
```
 
:::tip
IP ที่เพิ่มด้วย `ip addr add` จะหายไปเมื่อ Reboot ถ้าต้องการ Permanent ให้ใช้ Netplan ในส่วน 3.5
:::
 
**ตรวจสอบ Extra IP:**
 
```bash
# ดู IP ทั้งหมด
ip addr show eth0
 
# หรือ (Legacy)
ifconfig eth0
```
 
**ตัวอย่างผลลัพธ์:**
 
```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet 192.168.1.101/24 scope global secondary eth0
    inet 192.168.1.102/24 scope global secondary eth0
    inet 10.0.0.50/24 scope global eth0
```
 
---
 
## 3. การตั้งค่า Static IP ถาวร (Netplan)
 
Netplan เป็นเครื่องมือ Network Configuration บนสมัยใหม่ของ Ubuntu (17.10 ขึ้นไป) ใช้ไฟล์ YAML ในโฟลเดอร์ `/etc/netplan/`
 
### 3.1 ตรวจสอบไฟล์ Netplan ปัจจุบัน
 
```bash
# ดูรายการไฟล์ Netplan
ls -la /etc/netplan/
 
# ดูเนื้อหาไฟล์
cat /etc/netplan/01-netcfg.yaml
```
 
### 3.2 ตั้งค่า Static IP
 
สร้างหรือแก้ไขไฟล์ `/etc/netplan/01-netcfg.yaml`:
 
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```
 
**ตัวอย่าง Configuration สำหรับ Static IP:**
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```
 
:::warning ส่วนประกอบ
- `dhcp4: no` — ปิดใช้ DHCP (ใช้ Static IP)
- `addresses:` — IP Address พร้อม CIDR Notation (`/24` = `255.255.255.0`)
- `gateway4:` — IP ของ Gateway / Router
- `nameservers:` — DNS Server ที่ใช้
:::
### 3.3 ตั้งค่า DHCP (Dynamic IP)
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: yes
```
 
### 3.4 หลาย Interface พร้อมกัน
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
    eth1:
      dhcp4: yes  # Interface นี้ใช้ DHCP
```
 
### 3.5 เพิ่ม Extra IP / Secondary IP (Multiple IPs on Single Interface)
 
บ้านเวลาต้องการให้ Interface เดียวมีหลาย IP Address ก็สามารถเพิ่มได้ใน `addresses` ส่วนนี้:
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24          # Primary IP
        - 192.168.1.101/24          # Secondary IP 1
        - 192.168.1.102/24          # Secondary IP 2
        - 192.168.1.110/32          # Extra IP (Alias)
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```
 
:::tip
ใช้ CIDR Notation แต่ละ IP (เช่น `/24`, `/32`) เพื่อระบุ Subnet Mask
:::
 
**ตัวอย่าง: IP ต่างเน็ตเวิร์ก**
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24          # Network 1
        - 10.0.0.50/24              # Network 2
        - 172.16.0.200/24           # Network 3
      gateway4: 192.168.1.1
      routes:
        - to: 10.0.0.0/24
          via: 192.168.1.1
        - to: 172.16.0.0/24
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```
 
**ใช้ Configuration แล้ว:**
 
```bash
sudo netplan apply
ip addr show eth0    # ตรวจสอบ IP ทั้งหมด
```
 
### 3.5 ใช้ Interface ด้วยชื่อที่สมควร (Wireless)
 
```yaml
network:
  version: 2
  renderer: networkd
  wifis:
    wlan0:
      dhcp4: yes
      access-points:
        "WiFi-Network":
          password: "your_password"
```
 
### 3.6 ทดสอบและใช้ Configuration
 
```bash
# ทดสอบ Configuration ก่อน Apply
sudo netplan generate
 
# ทดสอบแบบมีการ Rollback (ถ้าไม่สำเร็จจะกลับมา 120 วินาที)
sudo netplan try
 
# ใช้งานจริง
sudo netplan apply
 
# ตรวจสอบผลลัพธ์
ip addr show
ip route show
```
 
---
 
## 4. ตั้งค่า DNS
 
### 4.1 DNS บน Netplan
 
เพิ่มส่วน `nameservers` ในไฟล์ YAML:
 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        search: [example.com]        # DNS Search Domain
        addresses: [8.8.8.8, 8.8.4.4] # Google DNS
```
 
**Popular DNS Server:**
 
| DNS Server | Primary | Secondary |
|-----------|---------|-----------|
| Google | 8.8.8.8 | 8.8.4.4 |
| Cloudflare | 1.1.1.1 | 1.0.0.1 |
| Quad9 | 9.9.9.9 | 149.112.112.112 |
| OpenDNS | 208.67.222.222 | 208.67.220.220 |
 
### 4.2 ตรวจสอบ DNS ปัจจุบัน
 
```bash
# ดู resolv.conf
cat /etc/resolv.conf
 
# ทดสอบ DNS Resolution
nslookup google.com
dig google.com
dig google.com +short
```
 
---
 
## 5. การตรวจสอบและแก้ไขปัญหาเครือข่าย
 
### 5.1 `ping` — ตรวจสอบ Connectivity
 
```bash
# Ping ไปยังเครื่องอื่น (4 ครั้ง)
ping -c 4 google.com
 
# Ping โดยไม่มีลิมิต (กด Ctrl+C เพื่อหยุด)
ping google.com
 
# Ping ด้วย Host ที่กำหนด
ping -I eth0 192.168.1.1
```
 
**ตัวอย่างผลลัพธ์:**
 
```
PING google.com (142.250.80.46) 56(84) bytes of data.
64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=23.5 ms
64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=22.1 ms
```
 
| ฟิลด์ | ความหมาย |
|-------|----------|
| `icmp_seq` | ลำดับแพ็กเก็ต |
| `time=23.5 ms` | ความหน่วงเวลา (น้อยยิ่งดี) |
| `ttl` | Time To Live (ลดลง 1 ที่แต่ละ Router) |
 
### 5.2 `traceroute` — ติดตามเส้นทาง
 
`traceroute` แสดง Router ทั้งหมดที่แพ็กเก็ตผ่านไป
 
```bash
# ติดตามเส้นทาง
traceroute google.com
 
# จำกัดจำนวน Hop
traceroute -m 10 google.com
 
# ใช้ Protocol ต่างกัน
traceroute -I google.com  # ICMP
traceroute -T google.com  # TCP
```
 
**ตัวอย่างผลลัพธ์:**
 
```
1 192.168.1.1 (gateway) 1.234 ms
2 10.0.0.1 (ISP router) 5.432 ms
3 203.0.113.1 (backbone) 15.123 ms
4 * * * (Timeout - no response)
5 142.250.80.46 (destination) 23.456 ms
```
 
:::tip
ถ้าเห็น `*` ไปเรื่อย ๆ บ่งชี้ว่าตัวกั้นไฟร์วอลล์ปิดกั้นการ Trace เพื่อ Check ไป IP ตรง ๆ ดีกว่า
:::
 
### 5.3 `dig` / `nslookup` — ตรวจสอบ DNS
 
```bash
# ดู DNS Resolution
dig google.com
 
# ดูเฉพาะ IP Address
dig google.com +short
 
# Query DNS Server เฉพาะ
dig @8.8.8.8 google.com
 
# ดู Full DNS Record
dig google.com ANY
 
# nslookup (อีกตัวหนึ่ง)
nslookup google.com
nslookup google.com 8.8.8.8
```
 
**ตัวอย่างผลลัพธ์ `dig google.com +short`:**
 
```
142.250.80.46
142.250.80.78
142.250.80.46
```
 
### 5.4 `netstat` / `ss` — ตรวจสอบ Port และ Connection
 
```bash
# ดู Port ที่เปิดอยู่ (Modern - แนะนำ)
sudo ss -tulpn
 
# ดู Connection ทั้งหมด
sudo ss -tulpn
 
# ดู Connection ที่ ESTABLISHED
sudo ss -tulpn | grep ESTABLISHED
 
# Legacy command
netstat -tulpn
```
 
**อธิบายตัวเลือก:**
 
| ตัวเลือก | ความหมาย |
|---------|----------|
| `-t` | TCP Connections |
| `-u` | UDP Connections |
| `-l` | Listening Ports เท่านั้น |
| `-p` | แสดง Process ที่เปิด Port |
| `-n` | แสดง Port Number (ไม่สลับเป็นชื่อ Service) |
 
**ตัวอย่างผลลัพธ์:**
 
```
Proto Recv-Q Send-Q Local Address         Foreign Address         State   PID/Program name
tcp   0      0      0.0.0.0:22           0.0.0.0:*               LISTEN  1234/sshd
tcp   0      0      0.0.0.0:80           0.0.0.0:*               LISTEN  5678/nginx
tcp   0      64     192.168.1.100:22     192.168.1.50:54321      ESTABLISHED 1234/sshd
```
 
### 5.5 `curl` / `wget` — ทดสอบ HTTP/HTTPS
 
```bash
# ทดสอบเว็บไซต์
curl -I https://google.com
 
# ดาวน์โหลดไฟล์
wget https://example.com/file.zip
 
# ทดสอบ Response Time
curl -w "Time: %{time_total}s\n" https://google.com
```
 
---
 
## 6. Firewall Configuration (UFW)
 
UFW (Uncomplicated Firewall) เป็นเครื่องมือ Firewall ที่ค่อนข้างง่ายสำหรับ Ubuntu
 
### 6.1 ตรวจสอบและเปิด/ปิด UFW
 
```bash
# ตรวจสอบสถานะ
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
 
# เปิด Firewall
sudo ufw enable
 
# ปิด Firewall (ตัวอย่าง - ไม่แนะนำในผลิตชัน)
sudo ufw disable
 
# Reset กลับเป็นค่า Default
sudo ufw reset
```
 
:::warning
ถ้าเปิด UFW โดยยังไม่ Allow SSH ก่อน คุณจะถูก Lock ออกจากเซิร์ฟเวอร์! ลองสั่ง `sudo ufw allow OpenSSH` ก่อน
:::
 
### 6.2 กำหนด Default Policy
 
```bash
# ปิดกั้น Incoming ทั้งหมด (แนะนำ)
sudo ufw default deny incoming
 
# อนุญาต Outgoing ทั้งหมด
sudo ufw default allow outgoing
 
# ปิดกั้น Routed Traffic ทั้งหมด
sudo ufw default deny routed
```
 
### 6.3 Allow / Deny Ports
 
```bash
# Allow Port (TCP)
sudo ufw allow 22       # SSH
sudo ufw allow 80       # HTTP
sudo ufw allow 443      # HTTPS
 
# Allow Port ด้วยชื่อ Service
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Allow Port ระบุไอพีเครื่อง Server
sudo ufw allow to 192.168.1.0/24 443

# Allow Port ระบุไอพีเครื่อง Remote
sudo ufw allow from 192.168.1.0/24 443 
 
# Allow Port Range
sudo ufw allow 8000:9000/tcp
 
# Deny Port
sudo ufw deny 23/tcp    # Telnet (insecure)
sudo ufw deny 3306      # MySQL (external access)
 
# Reject Port (ส่ง error กลับ)
sudo ufw reject 23/tcp
```
 
### 6.3.1 ตั้งชื่อ/Comment ให้กฏ Firewall (Custom Rule Naming)
 
UFW รองรับการตั้งชื่อกฏเพื่อให้จำได้ว่าแต่ละกฏสำหรับอะไร ใช้ `comment` option:
 
```bash
# ตั้งชื่อเมื่อสร้างกฏใหม่
sudo ufw allow 80 comment 'Allow HTTP access from anywhere'
sudo ufw allow 443 comment 'HTTPS for web server'
sudo ufw allow from 192.168.1.0/24 to any port 22 comment 'SSH from local network only'
sudo ufw allow 3000/tcp comment 'Node.js application'
sudo ufw limit 22 comment 'Rate limit SSH for brute-force protection'
 
# Deny พร้อม Comment
sudo ufw deny 23/tcp comment 'Block Telnet - insecure protocol'
sudo ufw deny from 203.0.113.100 comment 'Block malicious IP'
```
 
:::tip 
ข้อดีของการใช้ Comment
- ช่วยจดจำว่าเพิ่มกฏนี้เพื่อสาเหตุใด
- เหมาะสำหรับ Documentation ของเซิร์ฟเวอร์
- ทำให้การ Maintenance ง่ายขึ้นเมื่อต้องทำความเข้าใจกฏเก่า
:::
**ดูกฏพร้อม Comment:**
 
```bash
sudo ufw status verbose
```
 
**ตัวอย่างผลลัพธ์:**
 
```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing)
 
To                         Action      From
--                         ------      ----
22/tcp                     LIMIT IN    Anywhere         # Rate limit SSH for brute-force protection
80/tcp                     ALLOW IN    Anywhere         # Allow HTTP access from anywhere
443/tcp                    ALLOW IN    Anywhere         # HTTPS for web server
3000/tcp                   ALLOW IN    Anywhere         # Node.js application
22/tcp                     ALLOW IN    192.168.1.0/24  # SSH from local network only
23/tcp                     DENY IN     Anywhere         # Block Telnet - insecure protocol
```
 
**เพิ่ม Comment ให้กฏที่มีอยู่แล้ว:**
 
ถ้าต้องการเพิ่ม Comment ให้กฏที่สร้างไว้แล้ว ให้พิมพ์กฏเดิมแล้วเพิ่ม `comment`:
 
```bash
# ถ้ากฏเดิม: sudo ufw allow 80
# ให้พิมพ์: 
sudo ufw allow 80 comment 'Allow HTTP access from anywhere'
 
# System จะถามให้ยืนยัน
# Updating existing rule (y/n): y
```
 
**ลบ Comment:**
 
```bash
# ลบกฏเพื่อลบ Comment
sudo ufw delete allow 80
# แล้วสร้างใหม่โดยไม่มี Comment
sudo ufw allow 80
```
 
### 6.4 Allow / Deny จาก IP Address เฉพาะ
 
```bash
# Allow SSH จาก IP เฉพาะ
sudo ufw allow from 203.0.113.50 to any port 22
 
# Block IP ทั้งหมด
sudo ufw deny from 203.0.113.100
 
# Block IP จากเข้า Port เฉพาะ
sudo ufw deny from 203.0.113.100 to any port 3306
 
# Allow Subnet เฉพาะ
sudo ufw allow from 192.168.1.0/24
```
 
### 6.5 Rate Limiting (ป้องกัน Brute-force)
 
```bash
# Limit SSH Connections (ปฏิเสธถ้า 6+ ครั้งใน 30 วินาที)
sudo ufw limit ssh
 
# Limit Port เฉพาะ
sudo ufw limit 22/tcp
sudo ufw limit 80/tcp
```
 
### 6.6 ลบ Rules
 
```bash
# ดู Rules พร้อมหมายเลข
sudo ufw status numbered
 
# ลบ Rules ตามหมายเลข
sudo ufw delete 3    # ลบ Rule ที่ 3
 
# ลบตามชื่อ Rule
sudo ufw delete allow 80
sudo ufw delete allow from 203.0.113.100
```
 
### 6.7 Application Profiles
 
UFW รองรับ Application Profiles ให้ใช้ Ports ทั้งหมดของแอปฯ
 
```bash
# ดู Available Applications
sudo ufw app list
 
# ดูรายละเอียด Application
sudo ufw app info "Nginx Full"
 
# Allow Application
sudo ufw allow "Nginx Full"
sudo ufw allow "OpenSSH"
```
 
---
 
## 7. Net-Tools Package (Legacy Network Tools)
 
`net-tools` เป็นแพ็กเกจที่รวมเครื่องมือเครือข่ายแบบเก่า เช่น `ifconfig`, `netstat`, `route`, `arp` เป็นต้น บนระบบสมัยใหม่ของ Ubuntu มักจะไม่ติดตั้งมาโดยค่า Default เพราะถูกแทนที่ด้วย `iproute2` (`ip` command) ที่ทำงานได้ดีกว่า
 
:::info
- **net-tools** คือแพ็กเกจเก่า (ค่อนข้างอายุ)
- **iproute2** คือแพ็กเกจใหม่ (แนะนำใช้)
- แต่ `net-tools` ยังใช้ได้ เพื่อใช้งานกับ Script เก่าหรือความคุ้นเคย
:::
### 7.1 ติดตั้ง net-tools
 
```bash
# ติดตั้ง net-tools
sudo apt update
sudo apt install net-tools -y
 
# ตรวจสอบว่าติดตั้งสำเร็จ
ifconfig --version
netstat --version
```
 
### 7.2 Tools ใน net-tools
 
| เครื่องมือ | ตำแหน่ง | ความหมาย |
|----------|---------|---------|
| `ifconfig` | `/sbin/ifconfig` | ดู/ตั้งค่า Network Interface (Legacy) |
| `netstat` | `/bin/netstat` | ดู Network Statistics & Connections |
| `route` | `/sbin/route` | ดู/ตั้ง Routing Table |
| `arp` | `/usr/sbin/arp` | ดู/ตั้ง ARP Cache |
| `nameif` | `/sbin/nameif` | เปลี่ยนชื่อ Network Interface |
| `rarp` | `/sbin/rarp` | Reverse ARP |
| `iptunnel` | `/sbin/iptunnel` | ตั้งค่า IP Tunnel |
| `ipmaddr` | `/sbin/ipmaddr` | ตั้งค่า IP Multicast |
| `mii-tool` | `/sbin/mii-tool` | Media Independent Interface Tool |
| `plipconfig` | `/sbin/plipconfig` | Parallel Line Interface Config |
| `slattach` | `/sbin/slattach` | Serial Line Attachment |
 
### 7.3 การใช้งาน net-tools
 
#### `ifconfig` — ดูและตั้งค่า Interface (Legacy)
 
```bash
# ดูทั้งหมด (รวม Down Interface)
ifconfig -a
 
# ดูเฉพาะ Interface ที่ Up
ifconfig
 
# ดู Interface ชื่อ eth0 เท่านั้น
ifconfig eth0
 
# ตั้ง IP Address (ชั่วคราว)
sudo ifconfig eth0 192.168.1.100
 
# ตั้ง Netmask
sudo ifconfig eth0 192.168.1.100 netmask 255.255.255.0
 
# เปิด/ปิด Interface
sudo ifconfig eth0 up
sudo ifconfig eth0 down
 
# ตั้ง MAC Address
sudo ifconfig eth0 hw ether 00:11:22:33:44:55
```
 
:::warning
`ifconfig` ถูก Deprecated แล้ว ควรใช้ `ip` command แทน ถ้าเป็นไปได้
:::
 
#### `netstat` — ดู Network Statistics (Legacy)
 
```bash
# ดู Listening Ports
netstat -tlnp
 
# ดู All Connections
netstat -anp
 
# ดู Established Connections เท่านั้น
netstat -anp | grep ESTABLISHED
 
# ดู Routing Table
netstat -r
 
# ดู Interface Statistics
netstat -i
 
# ดู TCP/UDP Statistics
netstat -s
```
 
**เปรียบเทียบ netstat vs ss:**
 
| netstat | ss | ความหมาย |
|---------|----|---------| 
| `netstat -tlnp` | `ss -tulpn` | ดู Listening Ports |
| `netstat -anp` | `ss -anp` | ดู All Connections |
| `netstat -r` | `ip route` | ดู Routing Table |
| `netstat -i` | `ip -s link` | ดู Interface Stats |
 
:::tip
`ss` (Socket Statistics) เร็วกว่า `netstat` เพราะอ่านข้อมูลจาก kernel ได้เร็วขึ้น ลองใช้ `ss` ดูครับ
:::
 
#### `route` — ดู/ตั้ง Routing Table (Legacy)
 
```bash
# ดู Routing Table
route
 
# ดัแบบ Numeric (ไม่สลับเป็นชื่อ Domain)
route -n
 
# เพิ่ม Route
sudo route add -net 192.168.2.0/24 gw 192.168.1.1 dev eth0
 
# ลบ Route
sudo route del -net 192.168.2.0/24
 
# ตั้ง Default Gateway
sudo route add default gw 192.168.1.1
```
 
**Modern equivalent:**
 
```bash
# ดู Routing Table (Modern)
ip route
 
# เพิ่ม Route (Modern)
sudo ip route add 192.168.2.0/24 via 192.168.1.1 dev eth0
 
# ลบ Route (Modern)
sudo ip route del 192.168.2.0/24 via 192.168.1.1
```
 
#### `arp` — ดู/ตั้ง ARP Cache
 
```bash
# ดู ARP Table
arp
 
# ดัแบบ Numeric
arp -e
 
# ดู ARP ของ Interface เฉพาะ
arp -i eth0
 
# เพิ่ม ARP Entry
sudo arp -s 192.168.1.50 00:11:22:33:44:55
 
# ลบ ARP Entry
sudo arp -d 192.168.1.50
```
 
**Modern equivalent:**
 
```bash
# ดู ARP Table (Modern)
ip neighbour
 
# ดู ARP ของ Interface เฉพาะ
ip neighbour show dev eth0
 
# เพิ่ม ARP Entry (Modern)
sudo ip neighbour add 192.168.1.50 lladdr 00:11:22:33:44:55 dev eth0
 
# ลบ ARP Entry (Modern)
sudo ip neighbour del 192.168.1.50 dev eth0
```
 
### 7.4 ข้อแนะนำ
 
**เมื่อใช้ net-tools:**
- ใช้ได้กับ Legacy Script ที่เก่า
- ใช้ได้เมื่อต้องการ Compatibility กับระบบเก่า
- แต่มี Performance ไม่เท่ากับ iproute2
**เมื่อควรใช้ iproute2 (ip command):**
- ระบบใหม่ (Ubuntu 17.10 ขึ้นไป)
- ต้อง Performance ที่ดี
- ต้องใช้ฟีเจอร์ IPv6, VLAN, Tunnel
- Script ใหม่ที่จะ Maintain อีกนาน
---
 
## 8. Network Interface Advanced Configuration
 
### 8.1 จัดการ Extra IP ขั้นสูง
 
#### ดู Extra IPs บนหลาย Interface
 
```bash
# ดู IP ทั้งหมดบนเซิร์ฟเวอร์
ip addr show
 
# หรือดูแบบสั้น
ip a
 
# ดูเฉพาะ Interface eth0
ip addr show eth0
 
# ดูเฉพาะ Primary IP
ip addr show eth0 | grep "inet " | head -1
 
# ดูจำนวน IP ทั้งหมด
ip addr show eth0 | grep "inet " | wc -l
```
 
#### ลบและจัดการ Extra IPs
 
```bash
# ดู IP ทั้งหมด
ip addr show eth0
 
# ลบ IP เฉพาะตัว
sudo ip addr del 192.168.1.101/24 dev eth0
 
# ลบหลาย IP พร้อมกัน
sudo ip addr del 192.168.1.102/24 dev eth0
sudo ip addr del 192.168.1.103/24 dev eth0
sudo ip addr del 10.0.0.50/24 dev eth0
 
# ล้าง IP ทั้งหมด (ยกเว้น Loopback)
sudo ip addr flush dev eth0
```
 
:::warning
ถ้า SSH ผ่าน Primary IP การ flush IP อาจทำให้ Session ขาด! ใช้ Netplan ในการจัดการ Permanent IPs จะปลอดภัยกว่า
:::
 
#### ทดสอบ Extra IP
 
```bash
# Ping จากเซิร์ฟเวอร์อื่น
ping 192.168.1.101
 
# ทดสอบ SSH บน Extra IP
ssh user@192.168.1.101
 
# ทดสอบ HTTP บน Extra IP
curl -I http://192.168.1.101:80
 
# ตรวจสอบว่า IP Listening
sudo ss -tulpn | grep 192.168.1.101
 
# แสดง Process ที่ Bind บน Port ของ Extra IP
sudo netstat -tulpn | grep 192.168.1.101
```
 
#### Script เพิ่ม Extra IPs จากนัยหนึ่ง
 
```bash
#!/bin/bash
# add-extra-ips.sh
# เพิ่ม Extra IPs จากไฟล์ที่มี IP List
 
INTERFACE="eth0"
IP_FILE="ips.txt"
 
# Format ของ ips.txt:
# 192.168.1.101/24
# 192.168.1.102/24
# 10.0.0.50/24
 
while IFS= read -r ip; do
    if [ -n "$ip" ]; then
        echo "Adding IP: $ip"
        sudo ip addr add $ip dev $INTERFACE
    fi
done < "$IP_FILE"
 
echo "Done. Current IPs:"
ip addr show $INTERFACE | grep "inet "
```
 
**ใช้ script:**
 
```bash
chmod +x add-extra-ips.sh
./add-extra-ips.sh
```
 
### 8.2 กำหนด MAC Address
 
```bash
# ดู MAC Address
ip link show
 
# เปลี่ยน MAC Address ชั่วคราว (ต้อง Down interface ก่อน)
sudo ip link set eth0 down
sudo ip link set eth0 address 00:11:22:33:44:55
sudo ip link set eth0 up
 
# ดู MAC ใหม่
ip link show eth0
```
 
### 8.3 MTU (Maximum Transmission Unit)
 
```bash
# ดู MTU ปัจจุบัน
ip link show eth0
 
# เปลี่ยน MTU
sudo ip link set eth0 mtu 9000
 
# Verify
ip link show eth0 | grep mtu
```
 
---
 
## 9. เทคนิคการ Troubleshoot Network
 
### ขั้นตอนการตรวจสอบจากง่ายไปยาก:
 
```bash
# 1. ตรวจสอบ Interface
ip link show
 
# 2. ตรวจสอบ IP Configuration
ip addr show
 
# 3. ตรวจสอบ Gateway
ip route show
 
# 4. Ping Gateway
ping -c 4 192.168.1.1
 
# 5. Ping DNS Server
ping -c 4 8.8.8.8
 
# 6. ทดสอบ DNS Resolution
dig google.com +short
 
# 7. Ping Destination
ping -c 4 google.com
 
# 8. ติดตามเส้นทาง
traceroute google.com
 
# 9. ตรวจสอบ Port ที่เปิด
sudo ss -tulpn | grep LISTEN
 
# 10. ดู Firewall Rules
sudo ufw status verbose
```
 
### Script Diagnostic แบบเต็มรูป:
 
```bash
#!/bin/bash
# network-diagnosis.sh
 
TARGET=${1:-google.com}
echo "=== Network Diagnostics for $TARGET ==="
 
echo -e "\n1. Network Interfaces:"
ip link show
 
echo -e "\n2. IP Configuration:"
ip addr show
 
echo -e "\n3. Routing Table:"
ip route show
 
echo -e "\n4. DNS Configuration:"
cat /etc/resolv.conf
 
echo -e "\n5. Testing Connectivity:"
ping -c 4 $TARGET
 
echo -e "\n6. Tracing Route:"
traceroute -m 15 $TARGET
 
echo -e "\n7. Testing DNS Resolution:"
dig $TARGET +short
 
echo -e "\n8. Open Ports:"
sudo ss -tulpn
 
echo -e "\n9. Firewall Status:"
sudo ufw status
```
 
---
 
## 10. สรุปการเลือกใช้คำสั่ง
 
| งาน | คำสั่ง |
|-----|--------|
| ดู IP Address | `ip addr show` |
| ดู Gateway | `ip route show` |
| ตั้ง Static IP | แก้ `/etc/netplan/01-netcfg.yaml` |
| เพิ่ม Extra IP ชั่วคราว | `sudo ip addr add 192.168.1.101/24 dev eth0` |
| เพิ่ม Extra IP ถาวร | แก้ `addresses:` ใน `/etc/netplan/01-netcfg.yaml` |
| ลบ Extra IP | `sudo ip addr del 192.168.1.101/24 dev eth0` |
| ตรวจสอบ Connectivity | `ping`, `traceroute` |
| ตรวจสอบ DNS | `dig`, `nslookup` |
| ดู Open Ports | `sudo ss -tulpn` |
| ค้นหา Process ที่ใช้ Port | `sudo ss -tulpn \| grep :80` |
| Allow Port ใน Firewall | `sudo ufw allow 80` |
| Allow Port + Comment | `sudo ufw allow 80 comment 'HTTP'` |
| Block IP ใน Firewall | `sudo ufw deny from 203.0.113.100` |
| Limit SSH (Brute-force) | `sudo ufw limit ssh` |
| ดู Firewall Rules | `sudo ufw status numbered` |