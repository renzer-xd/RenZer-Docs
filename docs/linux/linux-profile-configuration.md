---
sidebar_position: 12
title: Profile configuration
sidebar_label: 11. Profile configuration
description: ขั้นตอนสําคัญในการตั้งค่าบัญชีผู้ใช้เริ่มต้น (Default User) และชื่อของเครื่องเซิร์ฟเวอร์

---

## ขั้นตอน Profile Configuration

ในขั้นตอนการติดตั้งระบบปฏิบัติการ Ubuntu Server  จะต้องมีการกำหนดข้อมูลผู้ใช้และชื่อเครื่องในส่วน Profile Configuration ก่อนเริ่มกระบวนการคัดลอกไฟล์ระบบ

| ฟิลด์ (Field) | คำอธิบาย (Description) | ตัวอย่างการตั้งค่า (Example) |
|--------|---------|---------|
Your name |ชื่อเต็มหรือชื่ออ้างอิงของผู้รับผิดชอบระบบ | `Pongsakorn Pintong`
Your server's name | ชื่อเครื่องเซิร์ฟเวอร์ (Hostname) สำหรับระบุตัวตนบนระบบเครือข่าย | `ubuntu-node-01`
Pick a username | ชื่อผู้ใช้ระบบ (Account) สำหรับใช้ในขั้นตอน Login | `sysadmin หรือ deploy`
Choose a password | รหัสผ่านสำหรับเข้าใช้งานระบบ | `*********`
Confirm your password | ยืนยันรหัสผ่านเดิมอีกครั้งให้ตรงกัน | `*********`

## ข้อกำหนดและแนวทางปฏิบัติ (Best Practices)

1. Username Restrictions:
    - ต้องใช้ตัวพิมพ์เล็กภาษาอังกฤษเท่านั้น (a-z)
    - ห้ามมีช่องว่างหรืออักขระพิเศษ (ยกเว้นเครื่องหมายขีดกลาง - หรือขีดล่าง _ ขึ้นอยู่กับเวอร์ชัน)
    - ห้ามขึ้นต้นด้วยตัวเลข
2. Server Name (Hostname):

    - ควรตั้งชื่อให้สื่อถึงหน้าที่หรือสภาพแวดล้อมของเซิร์ฟเวอร์ เพื่อให้ง่ายต่อการดูแลรักษา (Management) และการทำ Monitoring ในอนาคต
3. Privileged Access (Sudo):
    - บัญชีผู้ใช้ (Username) ที่สร้างขึ้นในขั้นตอนนี้ จะได้รับสิทธิ์ในการบริหารจัดการระบบขั้นสูงสุดผ่านคำสั่ง sudo โดยอัตโนมัติ เนื่องจาก Ubuntu Server จะปิดการ Login ตรงผ่านบัญชี root ไว้ตั้งแต่เริ่มต้นเพื่อความปลอดภัย

