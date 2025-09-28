import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Pagination, 
  Avatar,
  Badge,
  Divider,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  StarFilled,
  FilterOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const EventPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteEvents, setFavoriteEvents] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  // Mock data - thay bằng API thực tế
  const [events] = useState([
    {
      id: 1,
      title: "Workshop React Advanced",
      description: "Học các kỹ thuật nâng cao trong React để xây dựng ứng dụng hiệu quả và scalable.",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=200&fit=crop",
      date: "2024-10-25",
      time: "09:00",
      location: "Hà Nội",
      category: "workshop",
      attendees: 120,
      maxAttendees: 150,
      price: 0,
      organizer: "Tech Vietnam",
      rating: 4.8,
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "AI & Machine Learning Summit",
      description: "Hội nghị công nghệ lớn nhất năm với sự tham gia của các chuyên gia hàng đầu.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
      date: "2024-11-15",
      time: "08:30",
      location: "TP.HCM",
      category: "conference",
      attendees: 500,
      maxAttendees: 800,
      price: 1500000,
      organizer: "AI Vietnam",
      rating: 4.9,
      tags: ["AI", "Machine Learning", "Technology"]
    },
    {
      id: 3,
      title: "Digital Marketing Bootcamp",
      description: "Khóa học intensive về digital marketing từ cơ bản đến nâng cao trong 3 ngày.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      date: "2024-10-30",
      time: "09:00",
      location: "Online",
      category: "bootcamp",
      attendees: 80,
      maxAttendees: 100,
      price: 2500000,
      organizer: "Marketing Pro",
      rating: 4.6,
      tags: ["Marketing", "SEO", "Social Media"]
    },
    {
      id: 4,
      title: "Startup Networking Night",
      description: "Đêm giao lưu kết nối cho cộng đồng startup và doanh nhân trẻ.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop",
      date: "2024-11-01",
      time: "18:00",
      location: "TP.HCM",
      category: "networking",
      attendees: 60,
      maxAttendees: 100,
      price: 0,
      organizer: "Startup Hub",
      rating: 4.4,
      tags: ["Startup", "Networking", "Business"]
    },
    {
      id: 5,
      title: "UX/UI Design Masterclass",
      description: "Workshop thực hành thiết kế UX/UI với case study thực tế từ các công ty lớn.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
      date: "2024-11-10",
      time: "09:30",
      location: "Đà Nẵng",
      category: "workshop",
      attendees: 45,
      maxAttendees: 60,
      price: 800000,
      organizer: "Design Vietnam",
      rating: 4.7,
      tags: ["UX", "UI", "Design"]
    },
    {
      id: 6,
      title: "Blockchain Technology Conference",
      description: "Khám phá tương lai của công nghệ Blockchain và ứng dụng trong thực tế.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      date: "2024-12-05",
      time: "08:00",
      location: "Hà Nội",
      category: "conference",
      attendees: 200,
      maxAttendees: 300,
      price: 1200000,
      organizer: "Blockchain VN",
      rating: 4.5,
      tags: ["Blockchain", "Web3", "Technology"]
    }
  ]);

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Hội nghị' },
    { value: 'bootcamp', label: 'Bootcamp' },
    { value: 'networking', label: 'Networking' }
  ];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const toggleFavorite = (eventId) => {
    setFavoriteEvents(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  const getAvailabilityStatus = (attendees, maxAttendees) => {
    const ratio = attendees / maxAttendees;
    if (ratio < 0.7) return { status: 'success', text: 'Còn nhiều chỗ' };
    if (ratio < 0.9) return { status: 'warning', text: 'Sắp hết chỗ' };
    return { status: 'error', text: 'Gần hết chỗ' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={1} style={{ color: 'white', marginBottom: '16px', fontSize: '48px' }}>
            Sự Kiện Công Nghệ
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
            Khám phá các sự kiện công nghệ hàng đầu và kết nối với cộng đồng
          </Text>
          <div style={{ marginTop: '24px' }}>
            <Space size="large">
              <div style={{ color: 'white', fontSize: '16px' }}>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                50+ Sự kiện/tháng
              </div>
              <div style={{ color: 'white', fontSize: '16px' }}>
                <UserOutlined style={{ marginRight: '8px' }} />
                10,000+ Thành viên
              </div>
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Search and Filter */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Search
                placeholder="Tìm kiếm sự kiện..."
                allowClear
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Danh mục"
                size="large"
                style={{ width: '100%' }}
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
            </Col>
            
          </Row>
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col span={24}>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Tìm thấy <strong>{filteredEvents.length}</strong> sự kiện
            </Text>
          </Col>
        </Row>

        {/* Events Grid */}
        {paginatedEvents.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedEvents.map(event => {
                const availability = getAvailabilityStatus(event.attendees, event.maxAttendees);
                return (
                  <Col xs={24} md={12} lg={8} key={event.id}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          <img
                            alt={event.title}
                            src={event.image}
                            style={{ 
                              height: '200px', 
                              objectFit: 'cover',
                              width: '100%'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <Button
                              type="text"
                              icon={favoriteEvents.has(event.id) ? <HeartFilled /> : <HeartOutlined />}
                              style={{ 
                                background: 'rgba(255,255,255,0.9)', 
                                color: favoriteEvents.has(event.id) ? '#ff4d4f' : '#666'
                              }}
                              onClick={() => toggleFavorite(event.id)}
                            />
                          </div>
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px'
                          }}>
                            <Badge 
                              status={availability.status} 
                              text={
                                <span style={{ 
                                  background: 'rgba(255,255,255,0.9)', 
                                  padding: '2px 8px', 
                                  borderRadius: '12px',
                                  fontSize: '12px'
                                }}>
                                  {availability.text}
                                </span>
                              } 
                            />
                          </div>
                        </div>
                      }
                      actions={[
                        <Button 
                          type="primary" 
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                          }}
                        >
                          Đăng ký
                        </Button>
                      ]}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <Space>
                          <Tag color="blue">
                            {categories.find(cat => cat.value === event.category)?.label}
                          </Tag>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StarFilled style={{ color: '#faad14', fontSize: '12px' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>{event.rating}</Text>
                          </div>
                        </Space>
                      </div>

                      <Title level={4} style={{ marginBottom: '8px', minHeight: '48px' }}>
                        {event.title}
                      </Title>

                      <Paragraph 
                        ellipsis={{ rows: 2 }} 
                        style={{ color: '#666', marginBottom: '16px' }}
                      >
                        {event.description}
                      </Paragraph>

                      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined style={{ color: '#666' }} />
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {formatDate(event.date)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ClockCircleOutlined style={{ color: '#666' }} />
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {event.time}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <EnvironmentOutlined style={{ color: '#666' }} />
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {event.location}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <UserOutlined style={{ color: '#666' }} />
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {event.attendees}/{event.maxAttendees} người tham gia
                          </Text>
                        </div>
                      </Space>

                      <div style={{ marginBottom: '16px' }}>
                        <Space wrap>
                          {event.tags.slice(0, 3).map(tag => (
                            <Tag key={tag} size="small">#{tag}</Tag>
                          ))}
                        </Space>
                      </div>

                      <Divider style={{ margin: '12px 0' }} />

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                          {formatPrice(event.price)}
                        </Text>
                        <Button
                          type="text"
                          icon={<ShareAltOutlined />}
                          style={{ color: '#666' }}
                        >
                          Chia sẻ
                        </Button>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination */}
            {filteredEvents.length > pageSize && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Pagination
                  current={currentPage}
                  total={filteredEvents.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} sự kiện`
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Empty
              description="Không tìm thấy sự kiện nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;