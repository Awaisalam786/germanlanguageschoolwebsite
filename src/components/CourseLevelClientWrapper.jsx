'use client';

import React from 'react';
import CourseCard from './CourseCard';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function CourseLevelClientWrapper({ course }) {
  const { settings } = useGlobalContent();
  const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';

  const handleWhatsAppEnroll = (courseTitle, couponCode = null) => {
    let msg = `Hi, I want to enroll in ${courseTitle}.`;
    if (couponCode) msg += ` I am applying the coupon code: ${couponCode}.`;
    msg += ` Please share payment details.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <CourseCard
      course={{
        ...course,
        feesPKR: course.price,
        feesEUR: course.price,
        description: course.description || `Comprehensive German ${course.level} course.`,
        featuredBadge: course.badge || ''
      }}
      onEnroll={handleWhatsAppEnroll}
    />
  );
}
