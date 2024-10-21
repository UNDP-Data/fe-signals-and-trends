/* eslint-disable jsx-a11y/anchor-is-valid */
import { Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import { TrendDataType } from '../Types';

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
  insidePageSection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
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
  subNote: {
    fontSize: 7.5,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: font,
    marginBottom: 0,
    color: '#999',
  },
});

interface Props {
  data: TrendDataType;
}

export function TrendCardPage(props: Props) {
  const { data } = props;
  return (
    <Page style={styles.page} size={[230, 600]} orientation='landscape'>
      <View style={styles.insidePageSection}>
        <View
          style={{
            width: '200px',
            height: '230px',
          }}
        >
          <Image
            src={
              data.attachment ||
              'https://signals.data.undp.org/UNDP-hero-image.jpg'
            }
            style={{
              width: '200px',
              height: '230px',
              margin: '0',
            }}
          />
        </View>
        <View
          style={{
            width: 350,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: 6,
              paddingBottom: 12,
              paddingRight: 24,
              paddingLeft: 12,
            }}
          >
            <View>
              <Text style={styles.titleFirst}>{data.headline}</Text>
              <Text
                style={{
                  fontSize: 10.5,
                  textAlign: 'left',
                  fontFamily: font,
                  marginBottom: 12,
                  color: '#232E3D',
                  maxLines: 5,
                  textOverflow: 'ellipsis',
                  lineHeight: 1.5,
                }}
              >
                {data.description}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 15,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 10.5,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontFamily: `${font}-Bold`,
                    marginBottom: 6,
                    color: '#232E3D',
                  }}
                >
                  Time horizon
                </Text>
                <Text style={styles.tagText}>{data.time_horizon}</Text>
              </View>
              <View>
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
                  Impact
                </Text>
                {data.impact_rating ? (
                  <>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '2',
                        marginBottom: 5,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                          backgroundColor: '#006EB5',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                          backgroundColor:
                            parseInt(data.impact_rating?.split(' — ')[0], 10) >
                            1
                              ? '#006EB5'
                              : '#AAA',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                          backgroundColor:
                            parseInt(data.impact_rating?.split(' — ')[0], 10) >
                            2
                              ? '#006EB5'
                              : '#AAA',
                        }}
                      />
                    </View>
                    <Text style={styles.subNote}>
                      {data.impact_rating?.split(' — ')[1]}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.subNote}>Not Available</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}
