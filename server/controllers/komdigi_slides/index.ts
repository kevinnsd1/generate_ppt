import buildExecutiveSummary from './executiveSummary';
import buildVolumeChart from './volumeChart';
import buildTrendChart from './trendChart';
import buildHourlyTrendChart from './hourlyTrendChart';
import buildSocialMediaDetail from './socialMediaDetail';
import buildSentimentAnalysis from './sentimentAnalysis';
import buildSentimentMediaOnline from './sentimentMediaOnline';
import buildWordcloud from './wordcloud';
import buildPlatformMention from './platformMention';
import buildTopMedia from './topMedia';
import buildQuotes from './quotes';
import buildPostExamples from './postExamples';
import buildClosing from './closing';

const komdigiSlideHandlers: Record<string, (pptx: any, contents: any, titleSlide: string) => void> = {
  executiveSummary: buildExecutiveSummary,
  volumeChart: buildVolumeChart,
  trendChart: buildTrendChart,
  hourlyTrendChart: buildHourlyTrendChart,
  socialMediaDetail: buildSocialMediaDetail,
  sentimentAnalysis: buildSentimentAnalysis,
  sentimentMediaOnline: buildSentimentMediaOnline,
  wordcloud: buildWordcloud,
  platformMention: buildPlatformMention,
  topMedia: buildTopMedia,
  quotes: buildQuotes,
  postExamples: buildPostExamples,
  closing: buildClosing,
};

export default komdigiSlideHandlers;
