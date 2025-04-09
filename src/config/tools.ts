import { 
  TableCellsIcon,
  ClockIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  SwatchIcon,
  DocumentTextIcon,
  WrenchIcon,
  BeakerIcon,
  ChartBarIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CalculatorIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  CodeBracketSquareIcon
} from '@heroicons/vue/24/outline'

// 工具类型定义
export interface Tool {
  name: string
  description: string
  path: string
  icon: any
  status?: string
}

// 已实现的工具列表
export const implementedTools: Tool[] = [
  {
    name: 'JSON表格',
    description: '将JSON数据转换为表格形式展示',
    path: '/json-to-table',
    icon: TableCellsIcon
  },
  {
    name: '时间戳工具',
    description: '时间戳转换、时区转换等功能',
    path: '/timestamp',
    icon: ClockIcon
  },
  {
    name: '编码转换',
    description: '支持多种编码格式的转换工具',
    path: '/encoding',
    icon: CodeBracketIcon
  },
  {
    name: 'IP地址查询',
    description: '查询当前IP地址的详细信息',
    path: '/ip-lookup',
    icon: GlobeAltIcon
  },
  {
    name: '颜色工具',
    description: '颜色选择器、调色板、CSS渐变生成器',
    path: '/color-tools',
    icon: SwatchIcon
  },
  {
    name: '文档分割',
    description: '支持多种分隔符的文本分割与合并工具',
    path: '/document-splitter',
    icon: DocumentTextIcon
  },
  {
    name: 'HTML预览',
    description: '实时预览HTML代码效果',
    path: '/html-preview',
    icon: CodeBracketSquareIcon
  }
]

// 开发中的工具列表
export const developingTools: Tool[] = [
  {
    name: '文本工具',
    description: '文本处理、格式化、统计等',
    path: '/text-tools',
    icon: DocumentTextIcon,
    status: '开发中'
  },
  {
    name: '图片工具',
    description: '图片压缩、格式转换、编辑等',
    path: '/image-tools',
    icon: PhotoIcon,
    status: '开发中'
  },
  {
    name: '音频工具',
    description: '音频转换、剪辑、提取等',
    path: '/audio-tools',
    icon: MusicalNoteIcon,
    status: '开发中'
  },
  {
    name: '翻译工具',
    description: '多语言翻译、文本本地化',
    path: '/translation',
    icon: GlobeAltIcon,
    status: '开发中'
  },
  {
    name: '计算器',
    description: '科学计算、单位转换等',
    path: '/calculator',
    icon: CalculatorIcon,
    status: '开发中'
  },
  {
    name: '文档工具',
    description: '文档转换、合并、分割等',
    path: '/document-tools',
    icon: DocumentDuplicateIcon,
    status: '开发中'
  },
  {
    name: '数据分析',
    description: '数据可视化、统计分析等',
    path: '/data-analysis',
    icon: ChartBarIcon,
    status: '开发中'
  },
  {
    name: '开发工具',
    description: '代码格式化、压缩、混淆等',
    path: '/dev-tools',
    icon: WrenchIcon,
    status: '开发中'
  },
  {
    name: '实验工具',
    description: '各种实验性功能',
    path: '/experimental',
    icon: BeakerIcon,
    status: '开发中'
  }
]

// 导航栏工具列表
export const navigationTools: Tool[] = [
  ...implementedTools,
  {
    name: '更多工具',
    path: '/more',
    description: '查看更多工具',
    icon: PlusIcon
  }
] 