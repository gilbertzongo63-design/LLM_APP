import React, { useState } from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSync } from 'react-icons/fa';

const ResumeFilter = ({ categories, onFilter, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('');

  const handleFilter = () => {
    onFilter({
      searchTerm,
      category: selectedCategory,
      experience: experienceFilter
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setExperienceFilter('');
    onReset();
  };

  return (
    <div className="filter-section p-4 mb-4 bg-light rounded shadow-sm">
      <h5 className="mb-3">
        <FaFilter className="me-2" />
        Filter Resumes
      </h5>
      
      <Row className="g-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by title or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        
        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>
        
        <Col md={3}>
          <Form.Control
            placeholder="Experience (e.g., 5+ years)"
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
          />
        </Col>
        
        <Col md={2}>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleFilter}>
              Apply Filters
            </Button>
            <Button variant="outline-secondary" onClick={handleReset}>
              <FaSync />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResumeFilter;