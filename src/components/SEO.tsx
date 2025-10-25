import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'オトナバ - 30代以上の大人の交流掲示板',
  description = '30代以上の大人のための交流掲示板です。趣味、健康、旅行、グルメ、人生相談など様々なトピックで語り合いましょう。',
  keywords = '掲示板,30代,40代,50代,60代,大人,交流,コミュニティ,趣味,健康,旅行,グルメ,人生相談',
  ogImage = 'https://otonaba.vercel.app/og-image.jpg',
  url = 'https://otonaba.vercel.app',
  type = 'website'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;