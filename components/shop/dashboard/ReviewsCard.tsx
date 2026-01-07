"use client";

import React from "react";
import { Typography, Card, Avatar, Button } from "antd";
import { StarOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
}

interface ReviewsCardProps {
  reviews: Review[];
}

export const ReviewsCard: React.FC<ReviewsCardProps> = ({ reviews }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <StarOutlined className="text-warning" />
          <span>Últimas Avaliações</span>
        </div>
      }
      className="border-base-200"
      extra={
        <Link href="/owner/evaluations">
          <Button type="link" size="small">
            Ver todas
          </Button>
        </Link>
      }
    >
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-center gap-3 p-2 bg-base-200/50 rounded-lg">
            <Avatar size="small" icon={<UserOutlined />} />
            <div className="flex-grow">
              <Text className="text-sm">{review.customerName}</Text>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarOutlined
                    key={star}
                    className={star <= review.rating ? "text-warning text-xs" : "text-base-300 text-xs"}
                  />
                ))}
              </div>
            </div>
            <Text type="secondary" className="text-xs">
              {review.date}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReviewsCard;
