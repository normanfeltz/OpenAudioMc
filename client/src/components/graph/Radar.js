// I know this actually goes by the name starting with "R", but
// some people may want to use that for gameplay advantages so we shouldn't make it too obvious.

import React, {Component} from "react";
import PropTypes from "prop-types";

export class Radar extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    drawBlips = (ctx, entities, pyaw, blipColor) => {
        const player = this.props.player;
        const canvas = this.canvasRef.current;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        for (const entity of entities) {
            const dotX = Math.round(entity.x - player.x);
            const dotY = Math.round(entity.z - player.z);
            // Rotate the entity location by the player's yaw
            const rotatedX = dotX * Math.cos(pyaw) - dotY * Math.sin(pyaw);
            const rotatedY = dotX * Math.sin(pyaw) + dotY * Math.cos(pyaw);

            // Map the rotated entity location to the radar canvas
            const radarX = Math.round(rotatedX / radius * centerX) + centerX;
            const radarY = Math.round(rotatedY / radius * centerY) + centerY;

            if (radarX < 0 || radarX >= this.canvasRef.current.width || radarY < 0 || radarY >= this.canvasRef.current.height) {
                continue;
            }

            // is it in the center? then skip
            if (radarX === this.canvasRef.current.width / 2 && radarY === this.canvasRef.current.height / 2) {
                continue;
            }

            this.drawDot(ctx, radarX, radarY, blipColor);
        }
    };

    drawDot = (ctx, x, y, color) => {
        const size = 5;
        ctx.fillStyle = color;
        ctx.fillRect(x-(size/2), y-(size/2), size, size);
    };

    componentDidMount() {
        this.renderCanvas()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.renderCanvas()
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    renderCanvas = () => {
        const ctx = this.canvasRef.current.getContext("2d");
        const canvas = this.canvasRef.current;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'lightgray';
        ctx.fill();
        ctx.strokeStyle = 'darkgray';
        ctx.lineWidth = 2;
        ctx.stroke();

        const yaw = (this.toDegrees(this.props.player.yaw) + 180) % 360;
        this.drawBlips(ctx, this.props.entities, this.toRadians(yaw), "BLUE");

        this.drawDot(ctx, centerX, centerY, "BLACK");
    }

    render() {
        return (

                <canvas
                    style={{width: "100%", height: "100%"}}
                    width={242}
                    height={242}
                    ref={this.canvasRef}
                />

        );
    }
}

Radar.defaultProps = {
    player: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired,
}
