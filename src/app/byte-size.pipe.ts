import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteSize'
})
export class ByteSizePipe implements PipeTransform {
  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  transform(byteSize: number|string, precision: number = 2): string {
    let byteSizeNum = +byteSize;
    if (!isFinite(byteSizeNum)) {
      console.error(`${byteSize} is not a number`);
      return `${byteSize}`;
    }
    let unit = 0;
    while (byteSizeNum >= 1024) {
      byteSizeNum /= 1024;
      unit ++;
    }
    return `${byteSizeNum.toFixed(+precision)} ${this.units[unit]}`;
  }

}
