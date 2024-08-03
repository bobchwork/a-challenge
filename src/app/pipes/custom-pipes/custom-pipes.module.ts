import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatStringPipe } from '../format-string.pipe';

const pipes = [FormatStringPipe];
@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class CustomPipesModule {}
