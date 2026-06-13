import { LevelNode } from '../types';

export const STORY_NODES: Record<string, LevelNode> = {
  // ==========================================
  // STAGE 1: 诡秘医院 (The Cryptic Asylum)
  // ==========================================
  START: {
    id: 'START',
    title: '🏥 永罪疯人院 - 寒鸦牢笼',
    desc: '你从刺骨的钢制病床上苏醒，手铐已被挣断，四壁覆满暗红的抓痕。\n\n冷气从排风口呼呼灌入，夹杂着福尔马林的怪味与死尸的腥甜。铁门紧锁，只有一扇锈蚀的小观察窗，外面的走廊静得可怕。',
    atmosphere: '你感到手臂上浮现了一道螺旋形的古怪暗影烙印，每经历一次轮回，指纹处的设计就越发扭曲。',
    choices: [
      {
        text: '🔍 搜寻床底下的污旧床单与床板缝隙',
        next: 'ASYLUM_BED_SEARCH',
        sanDelta: -4,
        discoverClue: {
          id: 'hospital_escapee_note',
          title: '逃生者便签',
          description: '“走廊的尽头，光亮之处即是死路，药剂室的试管里藏着毁灭魔影的配方。”'
        }
      },
      {
        text: '🪵 走向厚重的铁桌，翻找布满蛛网的抽屉',
        next: 'ASYLUM_DESK_SEARCH',
        sanDelta: -2,
        gainItem: {
          id: 'ancient_talisman',
          name: '古老御魂符咒',
          description: '一张焦黄粗糙的黄纸符咒，上面用朱砂画着诡异多眼的图腾，似乎能驱散一次暗影物理伤害。',
          icon: 'ShieldAlert',
          rarity: 'rare'
        }
      },
      {
        text: '🚪 直接撞击铁门，查看能否用暴力挣裂锁扣',
        next: 'ASYLUM_FORCE_DOOR',
        sanDelta: -10,
        requireSan: 50
      }
    ]
  },

  ASYLUM_BED_SEARCH: {
    id: 'ASYLUM_BED_SEARCH',
    title: '🏥 永罪疯人院 - 壁角蛛丝',
    desc: '你在床垫边缘摸到了一把黏糊糊的【旧钥匙】和一截染了血的便头，上面写着求生密码。同时，你觉得病床深处有个阴恻恻的眼眶正盯着你。',
    choices: [
      {
        text: '🗝️ 拿走【旧钥匙】，悄悄摸向病房铁门',
        next: 'ASYLUM_GATE_KEY',
        sanDelta: -2,
        gainItem: {
          id: 'rusty_key',
          name: '旧宿舍钥匙',
          description: '一把布满铜绿和干涸血迹的钥匙，能够开启疯人院内的特定房间。',
          icon: 'Key',
          rarity: 'common'
        }
      },
      {
        text: '🗣️ 冲着病床底下的黑暗深处说：“谁在那里？”',
        next: 'ASYLUM_VOICE_IN_DARK',
        sanDelta: -15
      }
    ]
  },

  ASYLUM_DESK_SEARCH: {
    id: 'ASYLUM_DESK_SEARCH',
    title: '🏥 永罪疯人院 - 尘封抽屉',
    desc: '抽屉卡得极死，你用力一扯，伴随着令人牙酸的摩擦声。一张【古老御魂符咒】安稳地躺在污垢之中，其上的朱砂图腾似在微微悸动。\n\n此时，房门上的小铁窗突然划过一道猩红的目光！',
    choices: [
      {
        text: '🚪 立刻冲向铁门，查看窗外',
        next: 'ASYLUM_WINDOW_LOOK',
        sanDelta: -8
      },
      {
        text: '🧗 在门后死角静蹲，握紧符咒静观其变',
        next: 'ASYLUM_STEALTH_WAIT',
        sanDelta: -3
      }
    ]
  },

  ASYLUM_FORCE_DOOR: {
    id: 'ASYLUM_FORCE_DOOR',
    title: '🏥 永罪疯人院 - 暴力余响',
    desc: '你用肩膀猛撞铁门数次，门锁轰鸣巨响，钢栓变形。但巨大的动静惊醒了游荡在回廊的【食尸医师】！\n\n重物拖行的摩擦声迅速接近，你必须立刻决定去向。',
    choices: [
      {
        text: '🤜 在门后设伏，准备迎击怪物',
        next: 'ASYLUM_FIGHT_BEAST',
        sanDelta: -15,
        requireItem: 'ancient_talisman'
      },
      {
        text: '🚪 铁门开了个缝！抓紧时间夺门而逃',
        next: 'ASYLUM_CORRIDOR_FLEE',
        sanDelta: -8
      }
    ]
  },

  ASYLUM_VOICE_IN_DARK: {
    id: 'ASYLUM_VOICE_IN_DARK',
    title: '🏥 永罪疯人院 - 噬皮阴影',
    desc: '床底下的黑暗蠕动起来，一双惨白无皮的手臂猛然弹射出，指甲疯狂抠割你的面庞。你剧痛中拼死踹击反抗才摆脱它的纠缠，险些失去整张脸。',
    choices: [
      {
        text: '🏃 满脸鲜血，拼命推门逃出病房',
        next: 'ASYLUM_CORRIDOR_FLEE',
        sanDelta: -12
      }
    ]
  },

  ASYLUM_WINDOW_LOOK: {
    id: 'ASYLUM_WINDOW_LOOK',
    title: '🏥 永罪疯人院 - 极深窥伺',
    desc: '你把眼睛凑上铁窗，正对上一枚巨大的、半透明且布满复眼的眼球！那眼球疯狂旋转，发出令人作呕的咀嚼声。你的大脑嗡鸣，眼角溢出鲜血。',
    choices: [
      {
        text: '😱 捂着头跌倒在地，迅速向后爬行',
        next: 'ASYLUM_STEALTH_WAIT',
        sanDelta: -12
      }
    ]
  },

  ASYLUM_STEALTH_WAIT: {
    id: 'ASYLUM_STEALTH_WAIT',
    title: '🏥 永罪疯人院 - 窒息潜伏',
    desc: '你屏住呼吸蹲下。只听外面沉重的脚步声伴随着指甲划拉钢板的声音掠过大门。那异形生物在门前停顿了许久，发出刺耳的叹息后，缓缓远去。',
    choices: [
      {
        text: '🚪 确定怪物离开，推开虚掩的门前往走廊',
        next: 'ASYLUM_CORRIDOR_FLEE',
        sanDelta: -2
      }
    ]
  },

  ASYLUM_GATE_KEY: {
    id: 'ASYLUM_GATE_KEY',
    title: '🏥 永罪疯人院 - 撬开枷锁',
    desc: '你将【旧钥匙】死死捅入锁孔，生锈的机关卡卡作响，扭转的瞬间，咔哒一声！铁门露出了一道缝隙，走廊里吹来幽绿的鬼火之风。',
    choices: [
      {
        text: '🚶 轻推铁门，踏入暗无天日的中央回廊',
        next: 'ASYLUM_CORRIDOR_FLEE',
        sanDelta: -3
      }
    ]
  },

  ASYLUM_FIGHT_BEAST: {
    id: 'ASYLUM_FIGHT_BEAST',
    title: '🏥 永罪疯人院 - 生死博弈',
    desc: '扭曲的【食尸医师】撕碎大门闯入，你手中的【古老御魂符咒】释放出刺目的金色梵文屏障，强行将它的骨爪震得粉碎！\n\n怪物哀嚎退缩，跌入虚空，你在地上捡起了它掉落的一把细细的【纯银手术刀】！',
    choices: [
      {
        text: '🔪 带上这把寒气逼人的【纯银手术刀】离开',
        next: 'ASYLUM_CORRIDOR_FLEE',
        sanDelta: -2,
        gainItem: {
          id: 'silver_scalpel',
          name: '纯银除魔手术刀',
          description: '闪着冷硬光泽的特制手术刀，上面镌刻着净化符文，是刺穿高阶灵体核心的极佳兵器。',
          icon: 'Sword',
          rarity: 'rare'
        }
      }
    ]
  },

  ASYLUM_CORRIDOR_FLEE: {
    id: 'ASYLUM_CORRIDOR_FLEE',
    title: '🏥 永罪疯人院 - 斑驳走廊',
    desc: '你来到巨大的井状十字走廊，墙壁上插挂着惨白的点滴瓶，有些还在滴着胶状血。左侧标有「配药室 / PHARMACY」，牌子上满是手印；右侧是一座通往地下万生石坑的「排污斜坡」。',
    choices: [
      {
        text: '🧪 进入【配药室】，寻找可以治疗理智的药品或逃生物卡',
        next: 'ASYLUM_PHARMACY',
        sanDelta: -2,
        requireItem: 'rusty_key'
      },
      {
        text: '🧪 钥匙已失窃或不匹配，尝试强行踹击【配药室】的玻璃窗',
        next: 'ASYLUM_PHARMACY_FORCE',
        sanDelta: -8
      },
      {
        text: '🩸 绕过配药室，沿着散发诡秘嚎叫的【排污斜坡】向下',
        next: 'ASYLUM_UNDERGROUND',
        sanDelta: -10
      }
    ]
  },

  ASYLUM_PHARMACY_FORCE: {
    id: 'ASYLUM_PHARMACY_FORCE',
    title: '🏥 永罪疯人院 - 血碎玻璃',
    desc: '你一脚踹烂配药室的雕花玻璃窗，手掌被划得鲜血淋漓，惊恐的声音回荡在空间。但这也让你得以翻窗潜入。',
    choices: [
      {
        text: '🚪 进入药剂案台搜寻物品',
        next: 'ASYLUM_PHARMACY',
        sanDelta: -4
      }
    ]
  },

  ASYLUM_PHARMACY: {
    id: 'ASYLUM_PHARMACY',
    title: '🧪 配药室 - 化学实验之谜',
    desc: '案台上堆满了绿幽幽的烧杯，黑色的黑板上画着一幅「剧毒化学裂变配方」：\n\n“红色剧毒 + 蓝色酸液 = 橙色侵蚀弹(可破损魔界阵法)”。\n但如果不慎混合了黄色沉淀物，其蒸气会瞬间让人窒息死灭。你必须在两个试管组合中完美做出。',
    puzzle: {
      type: 'sequence',
      question: '黑板上的另一行暗笔写着：“元素结合的真因是，红(R)、蓝(B)、黄(Y)。生成裂变的密码是红蓝混合的拼音简写，加上沉淀物数量。提示为三个英文字母。”(答案是拼音合成词：RBY)',
      hint: '红黄蓝的首字母组合。',
      correctAnswer: 'RBY',
      onSuccessNode: 'ASYLUM_BOMB_CRAFTED',
      onFailNode: 'ASYLUM_CHEMICAL_EXPLOSION',
      failSanityDamage: 25
    }
  },

  ASYLUM_CHEMICAL_EXPLOSION: {
    id: 'ASYLUM_CHEMICAL_EXPLOSION',
    title: '💀 化学废料污染',
    desc: '你混合了错误的试管，灼热的紫雾瞬间喷薄而出，迅速腐蚀了你胸前的皮肤，有毒迷雾令你神经崩溃。你大声咳嗽着，从浓烟中跌退出来。',
    choices: [
      {
        text: '🏃 带伤向排污斜坡逃窜',
        next: 'ASYLUM_UNDERGROUND',
        sanDelta: -15
      }
    ]
  },

  ASYLUM_BOMB_CRAFTED: {
    id: 'ASYLUM_BOMB_CRAFTED',
    title: '🧪 配药室 - 提炼强效橙剂',
    desc: '你敏捷地按照配方滴定，伴随着轻微的气泡爆鸣，一管晶莹剔透、散发着刺鼻橘红色强光的【强酸爆裂弹】落入你的手中！黑板下的铁抽屉弹开，你还在里面发现了两袋【高浓度安神酚制剂】！',
    choices: [
      {
        text: '🎒 迅速收纳【强酸爆裂弹】，并喝下安神酚恢复理智',
        next: 'ASYLUM_UNDERGROUND',
        sanDelta: 30,
        gainItem: {
          id: 'acid_bomb',
          name: '强酸复合橙色爆裂弹',
          description: '蕴含极高腐蚀性和微型爆炸势能的化学橙剂。可用于炸开高硬度的地道铁门或溶穿怨魂结界。',
          icon: 'Bomb',
          rarity: 'rare'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 2: 无光列车 (Stage 2: The Abyssal Train)
  // ==========================================
  ASYLUM_UNDERGROUND: {
    id: 'ASYLUM_UNDERGROUND',
    title: '🩸 疯人院地窖 - 血污深孔',
    desc: '你顺由排污坡滑落，底部是一口由人体残碎白骨堆砌成的“血池祭坛”。在祭坛中心，一道黑色黏腻的大理石门死死封塞在此，上面附着一层散发着黑烟的「怨气锁链」。\n\n虚空的声音嘲讽道：『没有毁灭之物，你便永远留在此处，陪同千百世的牺牲者！』',
    choices: [
      {
        text: '💣 投掷【强酸复合橙色爆裂弹】炸碎怨灵封印',
        next: 'TRAIN_STATION_ARRIVAL',
        sanDelta: -5,
        removeItem: true,
        requireItem: 'acid_bomb'
      },
      {
        text: '📜 展示【古老御魂符咒】，尝试用梵文净化石门锁链',
        next: 'TRAIN_STATION_ARRIVAL',
        sanDelta: -10,
        removeItem: true,
        requireItem: 'ancient_talisman'
      },
      {
        text: '🩸 用肉身骨血拼死撞击石门缝（强行突破，损耗巨额理智并直接导致难度激增）',
        next: 'TRAIN_STATION_BLOOD_FORCE',
        sanDelta: -45
      }
    ]
  },

  TRAIN_STATION_BLOOD_FORCE: {
    id: 'TRAIN_STATION_BLOOD_FORCE',
    title: '🩸 牺牲拼搏 - 破碎的肉体',
    desc: '你拼死撞门，骨头发出碎裂的哀鸣，但恐怖的意志居然让你生生把这黑石大门撞偏了数寸！你浑身浴血，像死尸一样跌进了石门后的漫天大雾中，轮回重压再次在你脑中狂啸。',
    choices: [
      {
        text: '🌪️ 在冰冷虚空中缓缓抬起头来',
        next: 'TRAIN_STATION_ARRIVAL',
        sanDelta: -5,
        loopDelta: 1
      }
    ]
  },

  TRAIN_STATION_ARRIVAL: {
    id: 'TRAIN_STATION_ARRIVAL',
    title: '🚂 轮回应答站 - 终末号列车',
    desc: '你突破大门，迎面是一阵冷冽至极的铁轨蒸汽。你正站在一座无顶的中世纪蒸汽火车站，四周大雪纷飞。\n\n一辆用纯黑钢甲外裹、如同金属巨兽般的【极夜万骨号列车】发出汽笛低吼，静泊在站台。列车上刻着无数痛苦扭曲的死者人面，车厢窗户隐约透出忽明忽暗的黄光。',
    choices: [
      {
        text: '🎟️ 在站牌旁的乘票机处，尝试提取乘车通行证',
        next: 'TRAIN_TICKET_PUZZLE',
        sanDelta: -3,
        discoverClue: {
          id: 'conductor_memo',
          title: '乘务员备忘铁牌',
          description: '“终点站前的驾驶室需要三位神使的象征代码（1、4、8）。切勿对乘客对视超过3秒。”'
        }
      },
      {
        text: '🧗 绕开检票口，直接攀爬列车两侧的排气梯，强登第2节车厢',
        next: 'TRAIN_PASSENGER_CAR',
        sanDelta: -10
      }
    ]
  },

  TRAIN_TICKET_PUZZLE: {
    id: 'TRAIN_TICKET_PUZZLE',
    title: '🚂 铁轨碎屑 - 数字罗盘',
    desc: '售票机荧幕上满是暗斑，上面写着一串斑驳的代码：\n\n“逆行无光列车，车次为 A → B → C（密码按A,B,C排列）。已知A是双子星之数，B是撒旦的羊角，C是北斗星的极数。请在输入阀处按下对应之密。”',
    puzzle: {
      type: 'keypad',
      question: '求A,B,C组成的3位数值 (双子=2, 羊角=2, 北斗星极数[北斗七星]=7。答案是：227)',
      hint: '每个词对应的数字连在一起。数字依序代表双子、羊角（2个角）、北斗（七星）。',
      correctAnswer: '227',
      onSuccessNode: 'TRAIN_PLATFORM_VIP',
      onFailNode: 'TRAIN_PLATFORM_AMBUSH',
      failSanityDamage: 18
    }
  },

  TRAIN_PLATFORM_AMBUSH: {
    id: 'TRAIN_PLATFORM_AMBUSH',
    title: '🚂 汽笛轰鸣 - 吞魂鬼影',
    desc: '输入错误后，机器内溢出滚滚白骨黑烟。几个由碎尸组成的【执纪乘警】从长椅下站起，骨制警棍暴戾挥来！你拼尽全力撞碎二号车窗翻入车厢，全身布满淤青。',
    choices: [
      {
        text: '🚪 满腔冷汗中，在昏沉的车厢地毯上爬起',
        next: 'TRAIN_PASSENGER_CAR',
        sanDelta: -8
      }
    ]
  },

  TRAIN_PLATFORM_VIP: {
    id: 'TRAIN_PLATFORM_VIP',
    title: '🚂 列车中舱 - 贵宾乘车券',
    desc: '密码核验成功，一张泛着银质光芒的【幽冥贵宾专属车票】滑落到你手里。拿着这张车票，不仅可以让巡逻的列车长对你熟视无睹，甚至能平复你内心的一些慌乱。',
    choices: [
      {
        text: '🎟️ 收好车票，优雅从侧面检票门踏入第2车厢',
        next: 'TRAIN_PASSENGER_CAR',
        sanDelta: 8,
        gainItem: {
          id: 'vip_ticket',
          name: '幽冥贵宾专属车票',
          description: '一张坚硬且极寒的白银质地车票，持有它能让大部分列车眷属免除敌意，抚平内心的躁动。',
          icon: 'Ticket',
          rarity: 'rare'
        }
      }
    ]
  },

  TRAIN_PASSENGER_CAR: {
    id: 'TRAIN_PASSENGER_CAR',
    title: '🚂 极夜万骨号 - 诡雾乘客车厢',
    desc: '车厢里满是白雾，过道两侧密集成排坐着身着寿衣的乘客，每个人脸上都覆着一张厚重的报纸。随着列车的震动，所有人的报纸同时发出哗啦、哗啦的轻颤。\n\n最刺眼的是，车厢中间的铁柱上，贴着一张带有巨幅鬼脸的「列车管理条例」。',
    choices: [
      {
        text: '👁️ 侧身走过，顺便快速瞟一眼第一个乘客桌前的《冥府早报》',
        next: 'TRAIN_READ_PAPER',
        sanDelta: -5
      },
      {
        text: '🚶 不看不听，死死盯着地面快速向最前段的「驾驶室」移动',
        next: 'TRAIN_ENGINE_DOOR',
        sanDelta: -3
      },
      {
        text: '🎫 （如果你持有【幽冥贵宾专属车票】）向过道的空姐幽灵出示白银车票',
        next: 'TRAIN_CAR_CABIN_VIP_LUCK',
        sanDelta: 10,
        requireItem: 'vip_ticket'
      }
    ]
  },

  TRAIN_CAR_CABIN_VIP_LUCK: {
    id: 'TRAIN_CAR_CABIN_VIP_LUCK',
    title: '🚂 幽灵款待 - 魂晶露水',
    desc: '没有下巴的空姐空无一物，看见白银专属车票后朝你欠身行礼，并赠予你一杯散发清香的【冷泉凝露酒】。喝下后，你仿佛感到自己的脑电波在颤栗。物理灼伤和恐惧瞬间隐去。',
    choices: [
      {
        text: '🚶 容光焕发，昂领迈向驾驶舱中枢',
        next: 'TRAIN_ENGINE_DOOR',
        sanDelta: 20
      }
    ]
  },

  TRAIN_READ_PAPER: {
    id: 'TRAIN_READ_PAPER',
    title: '📰 冥府早报 - 二十六号轮回记录',
    desc: '你掀开乘客脸上的边角，上面写着血淋淋的讣告报导：“XX年永夜村全村祭神，以乾坤八卦阵封印地底之灵，生人禁忌，生肖密码藏在祠堂钟摆的倒影中，午时之刻为木。”\n\n突然门下的死人眼球骤然睁开！死人怪叫着朝你抓来！',
    choices: [
      {
        text: '🏃 踢踹其面颅，踉踉跄跄闯进前端隔离门',
        next: 'TRAIN_ENGINE_DOOR',
        sanDelta: -10,
        discoverClue: {
          id: 'village_ritual_hint',
          title: '生人祭海祭文',
          description: '“祠堂里的八卦天时封印，需要顺时针转动象征木行与火行的轮盘（即午时与巳时）。”'
        }
      }
    ]
  },

  TRAIN_ENGINE_DOOR: {
    id: 'TRAIN_ENGINE_DOOR',
    title: '🚂 极夜万骨号 - 疯狂熔炉驾驶舱',
    desc: '你冲到列车车头。一排散发着熔岩红光的巨型蒸汽阀门正在疯狂泄气，旁边堆满了森森白骨灰烬。\n驾驶舱前的操纵面板上布满拉杆，还有一尊「无眼机车神像」死死堵塞在此。它的脑门上篆刻着一圈符文，你需要输入三个神使象征的代码：',
    puzzle: {
      type: 'symbols',
      question: '根据你在此前获得的备忘录铁牌线索（1, 4, 8），这三个数字按从小到大排序的真能组合是什么？',
      hint: '直接输入那一组数字。即148。',
      correctAnswer: '148',
      onSuccessNode: 'TRAIN_RUSH_VILLAGE',
      onFailNode: 'TRAIN_CRASH_DEATH',
      failSanityDamage: 30
    }
  },

  TRAIN_CRASH_DEATH: {
    id: 'TRAIN_CRASH_DEATH',
    title: '💀 钢甲熔岩之死',
    desc: '你按错了蒸汽代码！巨大的熔核锅炉瞬间发出尖锐爆鸣，超压的1200度蒸汽将机车头瞬间撕得粉碎。你在无穷炽白火焰中，看见自己被熔炼成了列车窗户上的一颗哀嚎骷髅。',
    choices: [],
    isDeath: true,
    deathMsg: '你的肉体骨血化为机车燃烧的燃料，在此永无尽头地飞驰冲向悬崖。'
  },

  TRAIN_RUSH_VILLAGE: {
    id: 'TRAIN_RUSH_VILLAGE',
    title: '🚂 极夜万骨号 - 破壁飞行',
    desc: '你敲对了密钥！疯狂神像的双目爆发出刺目青光，拉杆自动复位，机车爆发出惊恐的加速！\n\n列车以突破物理边界的200公里时速，一头撞碎了前方永无止境的铁轨，一网砸向了底部的浓黑虚空。伴着剧烈的失重感，你开始旋转坠向下个世界。',
    choices: [
      {
        text: '🌪️ 在白骨天雨中坠落，任由思维在虚空中颠簸',
        next: 'VILLAGE_WHITE_FOG',
        sanDelta: -8,
        gainItem: {
          id: 'conductor_horn',
          name: '无目乘务员铜号角',
          description: '一件略带铁锈的重铜号角，吹响它时能发出凄厉悠长、干扰怨灵神魂的尖锐频率。',
          icon: 'Music',
          rarity: 'rare'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 3: 永夜村庄 (Stage 3: The Village of Eternal Night)
  // ==========================================
  VILLAGE_WHITE_FOG: {
    id: 'VILLAGE_WHITE_FOG',
    title: '🏮 永夜荒村 - 灰烬入口',
    desc: '你睁开眼，躺在阴风刺骨的小泥路上。天空中雪花与惨白的纸钱混杂交织。四周白雾漫野，只有路边不远处立着几座扎着纸童、纸马的旧牌坊。\n\n前方迷雾中高挂两排凄惨的绿皮灯笼，指引着两个地点：左侧是一口幽深无底、溢出诡异水雾的「锁魂枯井 / DEATH WELL」；右侧是全村最高处的「陈氏祖玄祭祀祠堂 / ANCESTRAL HALL」。',
    choices: [
      {
        text: '🕳️ 前往【锁魂枯井】，探视怨气源头，看是否能有奇遇',
        next: 'VILLAGE_WELL_ROOM',
        sanDelta: -8
      },
      {
        text: '⛩️ 稳步向前，通过满是纸人的庄严牌坊前往【陈氏祠堂】',
        next: 'VILLAGE_TEMPLE_GATE',
        sanDelta: -5
      }
    ]
  },

  VILLAGE_WELL_ROOM: {
    id: 'VILLAGE_WELL_ROOM',
    title: '🕳️ 锁魂枯井 - 寒尸碧幽',
    desc: '你站在枯井石台前。向下窥看，水井中居然填满了无数泛着青紫荧光的骨骸，骨殖之间隐约浮现一把晶莹剔透的水晶小尺，或者是一枚刻着真理图案的石板残块。\n\n冷水中一条幽冥的水猴子黑影正在水面疯狂盘旋，一旦下井极有可能遭遇致命袭击。',
    choices: [
      {
        text: '🗡️ 持有【纯银除魔手术刀】，一跃踏入冰冷的死水，物理超度怨蛇，夺取遗物',
        next: 'VILLAGE_WELL_SUCCESS',
        sanDelta: -10,
        requireItem: 'silver_scalpel'
      },
      {
        text: '🐚 吹响【无目乘务员铜号角】干扰并震慑水下的冤魂生物',
        next: 'VILLAGE_WELL_SUCCESS',
        sanDelta: -5,
        requireItem: 'conductor_horn'
      },
      {
        text: '🧗 在手无寸铁、神识衰弱的情况下强行攀爬湿滑的井壁（胜率极低）',
        next: 'VILLAGE_WELL_FAILURE',
        sanDelta: -30
      }
    ]
  },

  VILLAGE_WELL_FAILURE: {
    id: 'VILLAGE_WELL_FAILURE',
    title: '💀 坠入井底骨湖',
    desc: '没有武器与克制法器，你湿皮的手指一滑，瞬间一头扎进极寒的水域中。数十双冰寒蚀骨的鬼手瞬间将你拽沉海底，数千升死水一齐灌入你的胸腔。你的理智化为了水泡。',
    choices: [],
    isDeath: true,
    deathMsg: '你的冤魂化为这口枯井中新的淤沙，夜深时为过路的行人唱着阴恻的歌谣。'
  },

  VILLAGE_WELL_SUCCESS: {
    id: 'VILLAGE_WELL_SUCCESS',
    title: '🕳️ 锁魂枯井 - 捞取真理珍宝',
    desc: '无论是用纯银银刃在血雾里狂暴劈砍，还是吹响高昂的冥府号角。水下鬼影哀鸣着化作黑烟消散！\n\n你在残骸底部捡起了一件极其贵重的神圣遗物——【太极真理玉衡石板】！此石板上浮现不灭金光，护体安详，彻底免疫一次心魔冲击！',
    choices: [
      {
        text: '⛰️ 紧握石板，离开并直接奔赴祠堂高处',
        next: 'VILLAGE_TEMPLE_GATE',
        sanDelta: 15,
        gainItem: {
          id: 'truth_tablet',
          name: '太极真理玉衡石板',
          description: '镌刻着乾坤阴阳玄奥秘纹的白璧石板。握着它，便能看穿无限流中由古邪之神设立的一切真妄幻境，也是打通真理救赎结局的最关键媒介！',
          icon: 'Compass',
          rarity: 'cursed'
        }
      }
    ]
  },

  VILLAGE_TEMPLE_GATE: {
    id: 'VILLAGE_TEMPLE_GATE',
    title: '⛩️ 陈氏祠堂 - 诡火白堂',
    desc: '你来到大院，院子里整齐摆放着九十九具贴着封条的漆黑寿棺，寿馆前端点亮着白色冥烛。\n\n高耸的祠堂铁将军重门前有一块旋转乾坤锁扣，上面插挂着古香古色的黄铜太极仪。锁盘边缘刻着天干地支，你需要对齐太极之位。',
    choices: [
      {
        text: '🧩 尝试走上前旋转天干地支五行锁扣',
        next: 'VILLAGE_BAGUA_PUZZLE',
        sanDelta: -5
      }
    ]
  },

  VILLAGE_BAGUA_PUZZLE: {
    id: 'VILLAGE_BAGUA_PUZZLE',
    title: '🎴 乾坤倒转 - 五行八卦锁扣',
    desc: '根据你在《冥府早报》以及周遭环境发现的蛛丝马迹：\n“八卦金盘锁，五行中木能克土，木行对应的地支之首为‘寅’（拼音音节：YIN）。请输入能唤起风雷破法阵的拼音代码（3个大写字母）以彻底熔断大门铜锁。”',
    puzzle: {
      type: 'sequence',
      question: '求‘寅’的拼音大写组合（其实就是：YIN）。提示为3个英文字母。',
      hint: '地支寅木对应拼音：YIN。',
      correctAnswer: 'YIN',
      onSuccessNode: 'VILLAGE_TEMPLE_INTERIOR',
      onFailNode: 'VILLAGE_TEMPLE_TRAP_DEATH',
      failSanityDamage: 35
    }
  },

  VILLAGE_TEMPLE_TRAP_DEATH: {
    id: 'VILLAGE_TEMPLE_TRAP_DEATH',
    title: '💀 冥火万虫蛊毒之刑',
    desc: '你拨错轮盘！太极铜仪底部瞬间齿轮高速逆转，两排寿棺的封条瞬间断裂，数万只散发着绿火的【啃髓尸蛊】如黑瀑布般飞射而出，将你的衣帽、肉身、骨髓啃噬得干干净净。',
    choices: [],
    isDeath: true,
    deathMsg: '你的骸骨堆码在祠堂门槛外，成为警告后来轮回者的下一具白骨。'
  },

  VILLAGE_TEMPLE_INTERIOR: {
    id: 'VILLAGE_TEMPLE_INTERIOR',
    title: '⛩️ 陈氏祠堂 - 神神相扣',
    desc: '太极八卦锁咔嚓一声熔解，红漆重门向后打开。\n\n昏暗的主殿内并没有摆放神像，而是在中央立着一整面黑压压、用线香熏得焦黑的「万灵魂位神壁」。虚空最深处的嘶吼在回荡：\n『你解尽迷局，但也只剩这满舱的亡魂残局！有请真神古魔，为你的挣扎画上句点！』\n\n整座神壁缓缓向两侧裂开，后方是一条淌着浓浆、直接连接时空尽头的【虚无深渊眼眸】！',
    choices: [
      {
        text: '📜 展示【太极真理玉衡石板】并大声对神魔宣读无上真理',
        next: 'FINAL_SALVATION_ENDING',
        sanDelta: 30,
        requireItem: 'truth_tablet'
      },
      {
        text: '🗡️ 持有【纯银除魔手术刀】，孤注一掷将残缺的手术钢刀扎入虚无巨眼',
        next: 'FINAL_BLOOD_SEVERANCE',
        sanDelta: -20,
        requireItem: 'silver_scalpel'
      },
      {
        text: '😱 没有特殊媒介，空着双手在最后一刻扑向裂隙（无奈的残破献祭，迎接轮回重启）',
        next: 'FINAL_CYCLE_COLLAPSE',
        sanDelta: -60
      }
    ]
  },

  // ==========================================
  // ENDING NODES: 结局判定 (Ending Nodes)
  // ==========================================
  FINAL_CYCLE_COLLAPSE: {
    id: 'FINAL_CYCLE_COLLAPSE',
    title: '🌀 终末回摆 - 永无止境的轮回牢笼',
    desc: '你空手无凭地跌入神壁巨眼裂隙。无数邪异巨蛇触手瞬间卷过并将你的灵魂嚼碎，重塑发酵。你的意识再度沉入疯人院底层血泊。\n\n『徒劳无功的挣扎，回到你的起点去……』',
    choices: [],
    isDeath: true,
    deathMsg: '本层通关失败，但因为在最后的祠堂接触了深渊，下一周目开始时，你的初始轮回层数将激增！'
  },

  FINAL_BLOOD_SEVERANCE: {
    id: 'FINAL_BLOOD_SEVERANCE',
    title: '🗡️ 狂热血切 - 斩灵寂灭（完美暴力结局）',
    desc: '你发出一声雷霆暴喝，右腿蹬墙借力，整个人在失重空间腾跃而起，将闪耀着耀眼银电的【纯银除魔手术刀】死死砸进了深渊巨眼！\n\n『不！！蝼蚁的力量怎能触碰……』\n巨眼轰然爆炸，化为纯墨色的飞灰。周围的空间一寸一寸碎裂倒塌，你跌回到了暖烘烘的现实病房中，手腕上已没有任何枷锁烙印！',
    choices: [],
    isEnding: true,
    endingTitle: '🎉 【完美暴力结局：斩灵寂灭】',
    endingMsg: '你用无可匹敌的绝对意志和手术利刃撕裂了禁锢的世界，你已经回归现实，噩梦已被你亲手捏碎收割。'
  },

  FINAL_SALVATION_ENDING: {
    id: 'FINAL_SALVATION_ENDING',
    title: '🌟 真理破晓 - 永烁真章（真正天道脱困结局）',
    desc: '你神情平静，高举溢满温润玉光的【太极真理玉衡石板】。石板中的真理铭文瞬间化作漫天不灭的金华长龙飞舞，全副披靡，万鬼哭号，化为尘埃。那深渊之眸在金龙的净化下缓缓平复、闭合，崩陷成一条温暖澄净的白色光路。\n\n那光路的尽头是绿草如茵的高岗，和拂过你额发的温暖微风。',
    choices: [],
    isEnding: true,
    endingTitle: '🏆 【完美完美救赎结局：真理破晓】',
    endingMsg: '你洞悉了八卦仪理，搜集了散落诸世界的真理石板。深渊已除，尘缘散尽，所有的轮回者因你而得到升华，你踏上了归乡的阳光通途。'
  }
};
