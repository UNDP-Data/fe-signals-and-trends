/* eslint-disable react/destructuring-assignment */
import { Document } from '@react-pdf/renderer';
import { ObjForPrintingDataType, SignalDataType, TrendDataType } from './Types';
import { TrendsPage } from './PdfPageDesign/TrendPage';
import { SignalPage } from './PdfPageDesign/SignalPage';
import { SignalCardPage } from './PdfPageDesign/SignalCardPage';
import { TrendCardPage } from './PdfPageDesign/TrendCardPage';

interface Props {
  pages: ObjForPrintingDataType[];
  connectedSignalsForTrendsForPrinting: SignalDataType[];
  connectedTrendsForSignalsForPrinting: TrendDataType[];
}

export function PDFDocument(props: Props) {
  const {
    pages,
    connectedSignalsForTrendsForPrinting,
    connectedTrendsForSignalsForPrinting,
  } = props;
  return (
    <Document>
      {pages.map((d, i) =>
        d.type === 'trend' ? (
          d.mode === 'card' ? (
            <TrendCardPage key={i} data={d.data as TrendDataType} />
          ) : (
            <TrendsPage
              key={i}
              data={d.data as TrendDataType}
              connectedSignalsForTrendsForPrinting={
                connectedSignalsForTrendsForPrinting
              }
            />
          )
        ) : d.mode === 'card' ? (
          <SignalCardPage key={i} data={d.data as SignalDataType} />
        ) : (
          <SignalPage
            key={i}
            data={d.data as SignalDataType}
            connectedTrendsForSignalsForPrinting={
              connectedTrendsForSignalsForPrinting
            }
          />
        ),
      )}
    </Document>
  );
}
