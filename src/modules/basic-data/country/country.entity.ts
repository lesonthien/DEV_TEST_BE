import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DM_QUOC_GIA')
export class Country {
  @PrimaryColumn({ name: 'MA_QG' })
  id!: string; // 'id'

  @Column({ name: 'TEN_QG_VN', nullable: true })
  vietNamName?: string; // 'viet nam name'

  @Column({ name: 'TEN_QG_EN', nullable: true })
  englishName?: string; // 'english name'

  @Column({ name: 'TEN_QG_CN', nullable: true })
  chineseName?: string; // 'chinese name'

  @PrimaryColumn({ name: 'FACT_NO' })
  factNo!: string; // 'id'

  @Column({ name: 'CREATEBY', length: 20 })
  createdBy!: string;

  @Column({ name: 'CREATETIME', type: 'timestamp', nullable: true })
  createdTime?: Date;

  @Column({ name: 'USR_UPD', length: 20, nullable: true })
  updatedBy?: string;

  @Column({ name: 'TIME_UPD', type: 'timestamp', nullable: true })
  updatedTime?: Date;
}
