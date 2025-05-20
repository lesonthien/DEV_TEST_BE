import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DM_DS_PLAN')
export class PlannedSales {
  @PrimaryColumn({ name: 'FACT_NO' })
  factNo!: string;

  @PrimaryColumn({ name: 'MABOPHAN' })
  deptNo!: string;

  @PrimaryColumn({ name: 'THANG_NAM' })
  month!: Date;

  @Column({ name: 'DOANH_SO', nullable: true })
  planSale!: number;

  @Column({ name: 'CREATEBY', length: 20 })
  createdBy!: string;

  @Column({ name: 'CREATETIME', type: 'timestamp', nullable: true })
  createdTime?: Date;

  @Column({ name: 'USR_UPD', length: 20, nullable: true })
  updatedBy?: string;

  @Column({ name: 'TIME_UPD', type: 'timestamp', nullable: true })
  updatedTime?: Date;
}
