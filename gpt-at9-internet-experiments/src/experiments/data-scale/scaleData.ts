export const scaleLevels = [
  {
    power: 0,
    label: '字节',
    realm: '微观信息',
    example: 'UTF-8 下的一个 ASCII 字符。许多其他字符需要更多字节。',
  },
  {
    power: 1,
    label: '千 / 二进制千',
    realm: '短文本',
    example: '一个小配置文件，或者几段纯文本。',
  },
  {
    power: 2,
    label: '兆 / 二进制兆',
    realm: '媒体对象',
    example: '一张压缩照片、一小段音频，或一个应用资源。',
  },
  {
    power: 3,
    label: '吉 / 二进制吉',
    realm: '个人设备',
    example: '应用程序、视频、内存容量与日常传输。',
  },
  {
    power: 4,
    label: '太 / 二进制太',
    realm: '存储设备',
    example: '一块现代 SSD、工作站数据集，或一套备份。',
  },
  {
    power: 5,
    label: '拍 / 二进制拍',
    realm: '机架 / 企业',
    example: '大型存储集群、科研档案，或机群遥测。',
  },
  {
    power: 6,
    label: '艾 / 二进制艾',
    realm: '基础设施',
    example: '国家级或超大规模的数据资产与聚合流量。',
  },
] as const;
