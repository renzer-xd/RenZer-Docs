---
sidebar_position: 2
id: docker-commands-image
title: หมวดการจัดการ Image
sidebar_label: 2. หมวดการจัดการ Image
---

# หมวดการจัดการ Image (Image Management)
ใช้จัดการพิมพ์เขียวหรือตัวซอฟต์แวร์ต้นแบบ

-  ## ดูรายการ Image ทั้งหมดในเซิร์ฟเวอร์
```bash
docker images
```

-  ## ดาวน์โหลด Image จาก Docker Hub มาเก็บไว้ที่เครื่อง
```bash
docker pull <ชื่ออิมเมจ>:<แท็ก/เวอร์ชัน>
```

-  ## ลบ Image ออกจากเครื่อง
```bash
docker rmi <Image_ID_หรือชื่ออิมเมจ>
```

-  ## Build อิมเมจขึ้นมาเองจาก Dockerfile
```bash
docker build -t <ตั้งชื่ออิมเมจใหม่>:<แท็ก> .
# ตัวอย่าง: docker build -t my-custom-app:1.0 .
```
