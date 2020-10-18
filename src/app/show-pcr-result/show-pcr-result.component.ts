import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StationsService } from '../services/stations.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PatientRow {
  barcode_station0: string;
  barcode_stationA: string;
  barcode_stationB: string;
  barcode_stationC: string;
  barcode_PCR: string;
  rack_position: string;
  rack_number: string;
  pcr_position: string;
}

@Component({
  selector: 'app-show-pcr-result',
  templateUrl: './show-pcr-result.component.html',
  styleUrls: ['./show-pcr-result.component.css']
})
export class ShowPcrResultComponent implements OnInit {
  result: any;
  patient: PatientRow;
  chartSeries: Array<Array<{name: string; series: Array<{value: number, name: any}>}>>;
  series = ['hexRFU_points', 'famRFU_points', 'roxRFU_points', 'cy5RFU_points'];
  columns = ['NEC_hex', 'NEC_fam',  'NEC_rox',  'NEC_cy5','PCT_hex',  'PCT_fam', 'PCT_rox', 'PCT_cy5'];
  rows = ['Cq', 'RFU_endpoint'];

  constructor(
    private stationService: StationsService,
    @Inject(MAT_DIALOG_DATA) public data: {values: PatientRow}
  ) {
    this.patient = data.values;
    this.stationService.getResult(this.patient.barcode_PCR, this.patient.pcr_position)
    .subscribe(res => {
      this.result = res;
      this.chartSeries = this.series.map(seriesName => [Object({name: seriesName,
        series: this.result["wells_data"][seriesName].map((el, position) => Object({value: el, name: position}))})]);
    });

   }

  ngOnInit(): void {
  }

  printPdf(){
    const pdfContent = window.document.getElementById('canvas11');

    const HTML_Width = pdfContent.clientWidth;
    const HTML_Height = pdfContent.clientHeight;
    const top_left_margin = 15;
    const PDF_Width = HTML_Width + (top_left_margin * 2);
    const PDF_Height = PDF_Width * 1.4142;
    const canvas_image_width = HTML_Width;
    const canvas_image_height = HTML_Height;

    const totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas(pdfContent,{allowTaint: true}).then(canvas => {
      canvas.getContext('2d');
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF('p', 'px',  [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage();
        pdf.addImage(imgData
          , 'JPG'
          , top_left_margin
          , -(PDF_Height * i) + (top_left_margin )
          , canvas_image_width
          , canvas_image_height);
      }
      pdf.save(this.patient.barcode_station0 + '.pdf');
    });
  }
}
