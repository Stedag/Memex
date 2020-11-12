import React, { PureComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'

import colors from '../../../colors'
import { fonts } from '../../../styleConstants'

import {
    HoverState,
    DroppableState,
    SelectedState,
    NewItemsCountState,
} from 'src/dashboard-refactor/types'
import { MoreActionButtonState } from './types'

import Margin from 'src/dashboard-refactor/components/Margin'

// probably want to use timing function to get this really looking good. This is just quick and dirty
const blinkingAnimation = keyframes`
    0% {
        background-color: ${colors.onHover};
    }
    70% {
        background-color: transparent;
    }
    100% {
        background-color: ${colors.onHover};
    }
`

const Container = styled.div`
    height: 27px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    ${(props) =>
        props.isHovered &&
        css`
            background-color: ${colors.onHover};
        `}
    ${(props) =>
        props.isHovered &&
        props.isSelected &&
        css`
            background-color: ${colors.onSelect};
        `}
    ${(props) =>
        props.isBlinking &&
        css`
            animation: ${blinkingAnimation} 0.4s 2;
        `}
    `

const ListTitle = styled.div`
    font-family: ${fonts.primary.name};
    font-style: normal;
    ${(props) =>
        props.isSelected &&
        css`
            font-weight: ${fonts.primary.weight.bold};
        `}
    font-size: 14px;
    line-height: 21px;
    height: 18px;
`

const Icon = styled.div`
    height: 12px;
    width: 12px;
    font-size: 12px;
`

const NewItemsCount = styled.div`
    width: 30px;
    height: 14px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.midGrey};
    div {
        font-family: ${fonts.primary.name};
        font-weight: ${fonts.primary.weight.bold};
        font-size: 10px;
        line-height: 14px;
    }
`

export interface ListsSidebarItemProps {
    listName: string
    isEditing: boolean
    selectedState: SelectedState
    hoverState: HoverState
    droppableState: DroppableState
    newItemsCountState: NewItemsCountState
    moreActionButtonState: MoreActionButtonState
}

export default class ListsSidebarItem extends PureComponent<
    ListsSidebarItemProps
> {
    private handleDragOver() {
        this.props.droppableState.onDragOver()
    }
    private handleDragLeave() {
        this.props.droppableState.onDragLeave()
    }
    private handleDrop() {
        this.props.droppableState.onDrop()
    }
    private handleHoverEnter() {
        this.props.hoverState.onHoverEnter()
    }
    private handleHoverLeave() {
        this.props.hoverState.onHoverLeave()
    }
    private handleItemSelect() {
        this.props.selectedState.onSelection()
    }
    private renderIcon() {
        const {
            droppableState: { isDroppable, isDraggedOver },
            hoverState: { isHovered },
            newItemsCountState: { displayNewItemsCount, newItemsCount },
            moreActionButtonState: {
                onMoreActionClick,
                displayMoreActionButton,
            },
        } = this.props
        if (displayNewItemsCount)
            return (
                <NewItemsCount>
                    <div>{newItemsCount}</div>
                </NewItemsCount>
            )
        if (isDroppable && isDraggedOver) return <Icon>+</Icon>
        if (isHovered && displayMoreActionButton)
            return <Icon onClick={onMoreActionClick}>M</Icon>
    }
    private renderDefault() {
        const {
            listName,
            hoverState: { isHovered },
            selectedState: { isSelected },
            droppableState: { isBlinking },
            newItemsCountState: { displayNewItemsCount },
        } = this.props
        return (
            <Container
                onClick={this.handleItemSelect}
                onMouseEnter={this.handleHoverEnter}
                onMouseLeave={this.handleHoverLeave}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                isHovered={isHovered}
                isSelected={isSelected}
                isBlinking={isBlinking}
            >
                <Margin left="19px">
                    <ListTitle isSelected={isSelected}>{listName}</ListTitle>
                </Margin>
                {(isHovered || displayNewItemsCount) && (
                    <Margin right="7.5px">{this.renderIcon()}</Margin>
                )}
            </Container>
        )
    }
    private renderEditing() {
        const {
            listName,
            selectedState: { isSelected },
        } = this.props
        return (
            <Container isSelected={isSelected}>
                <Margin left="19px">
                    <ListTitle>{listName}</ListTitle>
                </Margin>
            </Container>
        )
    }
    render() {
        if (this.props.isEditing) return this.renderEditing()
        return this.renderDefault()
    }
}