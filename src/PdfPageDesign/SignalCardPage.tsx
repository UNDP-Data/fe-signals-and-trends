/* eslint-disable jsx-a11y/anchor-is-valid */
import { Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import { SignalDataType } from '../Types';

// Create styles
const font = 'Helvetica';
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F7F7F7',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  titleFirst: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: `${font}-Bold`,
    color: '#232E3D',
    marginTop: 12,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  tagText: {
    fontSize: 9,
    textAlign: 'left',
    fontFamily: font,
    paddingTop: 4,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: '#EDEFF0',
    border: 1,
    borderColor: '#D4D6D8',
    borderRadius: 20,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    color: '#232E3D',
  },
  tagsSection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 9,
  },
});

interface Props {
  data: SignalDataType;
}

export function SignalCardPage(props: Props) {
  const { data } = props;
  return (
    <Page style={styles.page} size={[430, 400]} orientation='landscape'>
      <View
        style={{
          width: '100%',
          maxHeight: 200,
        }}
      >
        <Image
          src={
            data.attachment ||
            'https://signals.data.undp.org/UNDP-hero-image.jpg'
          }
          style={{
            width: '100%',
            maxHeight: 200,
            margin: '0',
          }}
        />
      </View>
      <View
        style={{
          paddingLeft: 18,
          paddingRight: 18,
          paddingTop: 18,
          paddingBottom: 18,
          backgroundColor: '#F7F7F7',
        }}
      >
        {data.steep_primary ? (
          <View style={styles.tagsSection}>
            <Text style={styles.tagText}>
              {data.steep_primary.split(' – ')[0]}
            </Text>
            {data.steep_secondary
              ?.filter(d => d !== data.steep_primary)
              .map((d, i) => (
                <Text key={i} style={styles.tagText}>
                  {d.split(' – ')[0]}
                </Text>
              ))}
          </View>
        ) : null}
        <Text style={styles.titleFirst}>{data.headline}</Text>
        <Text
          style={{
            fontSize: 10.5,
            textAlign: 'left',
            fontFamily: font,
            marginBottom: 12,
            color: '#232E3D',
            maxLines: 3,
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
          }}
        >
          {data.description}
        </Text>
        <Text
          style={{
            fontSize: 10.5,
            textAlign: 'left',
            fontWeight: 'bold',
            fontFamily: `${font}-Bold`,
            marginBottom: 6,
            color: '#232E3D',
            textOverflow: 'ellipsis',
          }}
        >
          Keywords
        </Text>
        {data.keywords ? (
          <View style={styles.tagsSection}>
            {data.keywords.map((d, i) => (
              <Text key={i} style={styles.tagText}>
                {d}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </Page>
  );
}
