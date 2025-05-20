import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('USERS')
export class UserEntity {
  @PrimaryColumn({ name: 'USER_NO' })
  id!: string;

  @PrimaryColumn({ name: 'USER_FACT' })
  factNo?: string;

  @Column({ name: 'USER_NM' })
  fullname!: string;

  @Column({ name: 'USER_MAIL' })
  email!: string;

  @Column({ name: 'PHONE' })
  phone!: string;

  @Column({ name: 'USER_PW' })
  @Exclude()
  password!: string;

  @Column({ name: 'USERID_NO' })
  username!: string;

  @Column({ name: 'BRANCH_NO' })
  branchNo?: string;

  @Column({ name: 'DEPT_NO' })
  deptNo?: string;

  @Column({ name: 'QUYEN' })
  role?: string;
}
