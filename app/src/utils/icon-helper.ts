import lotto_6_42 from './../assets/lotto_6_42.png';
import lotto_6_55 from './../assets/lotto_6_55.png';
import lotto_6_58 from './../assets/lotto_6_58.png';
import lotto_6_45 from './../assets/lotto_6_45.png';
import lotto_6_49 from './../assets/lotto_6_49.png';
import lotto_6d from './../assets/lotto_6d.png';
import lotto_4d from './../assets/lotto_4d.png';
import lotto_3d from './../assets/lotto_3d.png';
import lotto_2d from './../assets/lotto_2d.png';
import no_image_available from './../assets/no_image_availabe.png'
import { LottoGame } from './constants';

const ICON_MAPPING: { [key in LottoGame]?: string } = {
  [LottoGame.ULTRA]: lotto_6_58,
  [LottoGame.GRAND]: lotto_6_55,
  [LottoGame.SUPER]: lotto_6_49,
  [LottoGame.MEGA]: lotto_6_45,
  [LottoGame.LOTTO]: lotto_6_42,
  [LottoGame.LOTTO_6D]: lotto_6d,
  [LottoGame.LOTTO_4D]: lotto_4d,
  [LottoGame.SWERTRES_3D_2PM]: lotto_3d,
  [LottoGame.SWERTRES_3D_5PM]: lotto_3d,
  [LottoGame.SWERTRES_3D_9PM]: lotto_3d,
  [LottoGame.SWERTRES_2D_2PM]: lotto_2d,
  [LottoGame.SWERTRES_2D_5PM]: lotto_2d,
  [LottoGame.SWERTRES_2D_9PM]: lotto_2d,
}
  
export function getLottoIcon(lottoGame: LottoGame | string): string {
  const icon = ICON_MAPPING[lottoGame as LottoGame];
  if (icon) {
    return icon;
  } 

  if (lottoGame === '3D Lotto') {
    return lotto_3d;
  }

  if (lottoGame === '2D Lotto') {
    return lotto_2d;
  }

  return no_image_available;
}

export function getDefaultIcon(): string {
  return no_image_available;
}