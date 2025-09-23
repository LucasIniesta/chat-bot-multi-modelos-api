import { ClaudeModels } from 'src/modules/model-provider/enums/claude-models.enum';
import { OpenAiModels } from 'src/modules/model-provider/enums/openai-models.enum';
import { TProviderModels } from 'src/modules/model-provider/types/provider-models.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class Conversation {
  //#TODO: Adicionar o modelo de IA usado na conversa
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: 'Nova conversa' })
  title: string;

  @Column({
    type: 'enum',
    enum: [...Object.values(ClaudeModels), ...Object.values(OpenAiModels)],
    default: OpenAiModels.GPT_5_NANO,
  })
  model: TProviderModels;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
  })
  messages: Message[];
}
