import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'คลังความรู้ส่วนตัว 📚',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        รวบรวมข้อมูล เทคนิค และทุกสิ่งที่คุณได้เรียนรู้มาจัดเก็บเป็นระเบียบในที่เดียว เพื่อสร้างห้องสมุดความรู้ของคุณเอง
      </>
    ),
  },
  {
    title: 'ทบทวนง่ายเมื่อลืม 🔍',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        ค้นหาข้อมูลย้อนหลังได้รวดเร็วด้วยกล่องค้นหาและโครงสร้าง Sidebar ที่แบ่งประเภทเนื้อหาอย่างเป็นสัดส่วน
      </>
    ),
  },
  {
    title: 'เขียนง่ายด้วย Markdown ✍️',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        จัดทำบทความและบันทึกย่อด้วยรูปแบบ Markdown และ MDX ที่ทรงพลัง รองรับการแทรกโค้ด การเตือนความจำ และหน้าจออินเตอร์แอคทีฟ
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
