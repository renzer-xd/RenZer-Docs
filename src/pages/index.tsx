import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

export default function HomePage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="คลังเก็บข้อมูล บันทึกความรู้ และการเรียนรู้ส่วนตัวของ RenZer"
    >
      <main style={{ padding: '2rem 0' }}>
        <section style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>RenZer Docs</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '760px', margin: '0 auto 1.5rem' }}>
            คลังเก็บข้อมูล บันทึกความรู้ และการเรียนรู้ส่วนตัวของ RenZer สำหรับการทบทวนและใช้เป็นแหล่งอ้างอิง
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="button button--primary button--lg" to="/docs">
              เริ่มอ่านเอกสาร
            </Link>
            <Link className="button button--secondary button--lg" to="/docs">
              ดูหมวดหมู่เอกสาร
            </Link>
          </div>
        </section>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
