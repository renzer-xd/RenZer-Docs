---
sidebar_position: 4
id: docker-commands-volume
title: หมวดการจัดการ Data Volume
sidebar_label: 3. หมวดการจัดการ Data Volume
---

# หมวดการจัดการ Data Volume (Storage Management)
ใช้จัดเก็บข้อมูลข้างในไม่ให้หายเวลา Container โดนลบหรืออัปเดต

-  ## ดูรายชื่อ Volume ทั้งหมด
```bash
docker volume ls
```

-  ## ลบ Volume ที่ไม่ได้ใช้งาน
```bash
docker volume rm <ชื่อวอลลุ่ม>
```

-  ## ดูรายละเอียดเชิงลึกของ Container (เช่น เลข IP ภายใน, ข้อมูลการแลกพอร์ต, เส้นทางไฟล์)
```bash
docker inspect <ชื่อหรือID_คอนเทนเนอร์>
```
