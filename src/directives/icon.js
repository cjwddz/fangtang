import coco from '@/assets/icons/avatar_coco.png'
import dbzq from '@/assets/icons/avatar_dbzq.png'
import elm from '@/assets/icons/avatar_elm.png'
import meituan from '@/assets/icons/avatar_meituan.png'
import mi from '@/assets/icons/avatar_mi.png'
import qcrxw from '@/assets/icons/avatar_qcrxw.png'
import wj from '@/assets/icons/avatar_wj.png'
import xb from '@/assets/icons/avatar_xb.png'

import logo from '@/assets/logo.svg'
import seal from '@/assets/icons/seal.svg'
import overdue from '@/assets/icons/overdue.svg'
import developer from '@/assets/icons/developer.svg'

const icon = {
  // avatar
  coco,
  dbzq,
  elm,
  meituan,
  mi,
  qcrxw,
  wj,
  xb,

  logo,
  seal,
  overdue,
  developer,
}
export default function (el, binding) {
  el.src = icon[binding.value] || '' // eslint-disable-line
}
