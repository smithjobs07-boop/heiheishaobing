import { Environment } from '../types';

export const SURVIVAL_ENVIRONMENTS: Environment[] = [
  {
    type: 'NORMAL',
    name: '🔴 猩红暗流 (Scarlet Undercurrent)',
    description: '浓稠的红褐色虚无烟雾漫步在空间中，不时响起指甲划拉玻璃的声浪。一切处于原罪意志的监视之下。',
    dangerLevel: 'medium',
    color: 'from-orange-950 to-neutral-900 border-red-900',
    effectText: '标准重压：理智衰减处于基础速率。幽灵警觉性正常。',
    sanCostMultiplier: 1.0
  },
  {
    type: 'BLIZZARD',
    name: '❄️ 极寒骨风暴 (Glacial Bone Gale)',
    description: '绝对冰点降临，极寒的雪风裹挟着死人骨灰呼呼吹过，刺入骨髓。连思绪和神智防线都在冰屑里被冻结。',
    dangerLevel: 'high',
    color: 'from-sky-950 to-slate-900 border-sky-800',
    effectText: '极寒创伤：所有抉择对理智的消耗提升 1.5 倍！血液循环降低，反应稍微迟缓。',
    sanCostMultiplier: 1.5
  },
  {
    type: 'TOXIC_FOG',
    name: '☣️ 窒居黑尸雾 (Choking Corpse Fog)',
    description: '一种由焦黑腐败肢体熔解产生的剧毒黑色酸雾弥漫在四周。吸入一口便伴随撕裂肺部的辛辣剧痛。',
    dangerLevel: 'deadly',
    color: 'from-emerald-950 to-stone-900 border-emerald-900',
    effectText: '酸烂剧毒：当任意抉择使你扣除理智时，该负面伤害额外追加 5 点剧毒反噬！',
    sanCostMultiplier: 1.1
  },
  {
    type: 'BLOOD_RAIN',
    name: '🌧️ 滂沱死血雨 (Torrential Death Blood-Rain)',
    description: '暗红色的死尸血雨从无星的穹顶坠落。打在肩膀上发出强酸般的滋滋融蚀声。视线严重受阻！',
    dangerLevel: 'high',
    color: 'from-red-950 to-stone-950 border-red-900',
    effectText: '强侵盲目：隐藏或观察类的节点会消耗更多理智。所有的医疗恢复效能下降 20%。',
    sanCostMultiplier: 1.2
  },
  {
    type: 'APPARITION_RISE',
    name: '💀 怨狂夜行 (Apparition Outbreak)',
    description: '轮回深层的千万怨灵因某种共鸣而发生暴动！墙缝、地底、甚至你自己的影子都在长出凄厉的人脸和手臂。',
    dangerLevel: 'deadly',
    color: 'from-purple-950 to-neutral-950 border-purple-900',
    effectText: '神鬼交感：理智判定限制上浮 10 点！灵体生物的危险指数暴增！',
    sanCostMultiplier: 1.3
  },
  {
    type: 'DEATHLY_SILENCE',
    name: '🤫 虚空死寂 (Abyssal Void Silence)',
    description: '所有的声息、回响、风鸣全部泯灭。极度压抑的寂静犹如重压般死死抵压在耳膜上，引人发狂。',
    dangerLevel: 'low',
    color: 'from-zinc-950 to-neutral-900 border-zinc-800',
    effectText: '死寂冥思：你难以通过声音判别危机。但此时静蹲与潜伏成功的概率将获得史诗级提升。',
    sanCostMultiplier: 0.8
  }
];
