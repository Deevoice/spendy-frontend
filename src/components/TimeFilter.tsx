'use client';

import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);

export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

interface TimeFilterProps {
    selectedPeriod: TimePeriod;
    onPeriodChange: (period: TimePeriod) => void;
    customStartDate: Date | null;
    customEndDate: Date | null;
    onCustomDateChange: (start: Date | null, end: Date | null) => void;
}

export const TimeFilter = ({
    selectedPeriod,
    onPeriodChange,
    customStartDate,
    customEndDate,
    onCustomDateChange,
}: TimeFilterProps) => {
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handlePeriodChange = (period: TimePeriod) => {
        onPeriodChange(period);
        if (period !== 'custom') {
            setShowCustomPicker(false);
        } else {
            setShowCustomPicker(true);
        }
    };

    return (
        <div className="time-filter">
            <div className="time-filter-buttons">
                <button
                    className={`time-filter-button ${selectedPeriod === 'day' ? 'active' : ''}`}
                    onClick={() => handlePeriodChange('day')}
                >
                    День
                </button>
                <button
                    className={`time-filter-button ${selectedPeriod === 'week' ? 'active' : ''}`}
                    onClick={() => handlePeriodChange('week')}
                >
                    Неделя
                </button>
                <button
                    className={`time-filter-button ${selectedPeriod === 'month' ? 'active' : ''}`}
                    onClick={() => handlePeriodChange('month')}
                >
                    Месяц
                </button>
                <button
                    className={`time-filter-button ${selectedPeriod === 'year' ? 'active' : ''}`}
                    onClick={() => handlePeriodChange('year')}
                >
                    Год
                </button>
                <button
                    className={`time-filter-button ${selectedPeriod === 'custom' ? 'active' : ''}`}
                    onClick={() => handlePeriodChange('custom')}
                >
                    Произвольный период
                </button>
            </div>
            {showCustomPicker && (
                <div className="custom-date-picker">
                    <div className="date-picker-group">
                        <label>От:</label>
                        <DatePicker
                            selected={customStartDate}
                            onChange={(date) => onCustomDateChange(date, customEndDate)}
                            selectsStart
                            startDate={customStartDate}
                            endDate={customEndDate}
                            maxDate={customEndDate || new Date()}
                            dateFormat="dd.MM.yyyy"
                            locale="ru"
                            className="date-picker-input"
                            placeholderText="Выберите дату"
                        />
                    </div>
                    <div className="date-picker-group">
                        <label>До:</label>
                        <DatePicker
                            selected={customEndDate}
                            onChange={(date) => onCustomDateChange(customStartDate, date)}
                            selectsEnd
                            startDate={customStartDate}
                            endDate={customEndDate}
                            minDate={customStartDate}
                            maxDate={new Date()}
                            dateFormat="dd.MM.yyyy"
                            locale="ru"
                            className="date-picker-input"
                            placeholderText="Выберите дату"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 