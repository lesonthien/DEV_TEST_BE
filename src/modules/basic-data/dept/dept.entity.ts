import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DM_DEPT')
export class Dept {
  @PrimaryColumn({ name: 'DEPT_NO' })
  id!: string; // 'id'

  @Column({ name: 'DEPT_NM', nullable: true })
  deptName?: string; // 'dept name'

  @Column({ name: 'GC_NGUNG', nullable: true })
  use?: string; // 'use'

  @Column({ name: 'NGAY_NGUNG', nullable: true })
  dateStop?: Date; // 'date stop'

  @PrimaryColumn({ name: 'FACT_NO' })
  factNo!: string; // 'factid'

  @PrimaryColumn({ name: 'BRANCH_NO' })
  branchNo!: string; // 'branchid'

  @Column({ name: 'QUAN_LY', nullable: true })
  manager?: string; // 'manager'

  @Column({ name: 'CREATEBY', length: 20 })
  createdBy!: string;

  @Column({ name: 'CREATETIME', type: 'timestamp', nullable: true })
  createdTime?: Date;

  @Column({ name: 'USR_UPD', length: 20, nullable: true })
  updatedBy?: string;

  @Column({ name: 'TIME_UPD', type: 'timestamp', nullable: true })
  updatedTime?: Date;
}
