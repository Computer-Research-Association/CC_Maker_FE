import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/HomeScreenStyles";

type GroupTitleProps = {
  myName: string;
  myPartner: string | { type: 'heart'; partners: string[] } | null;
  teamName: string | null;
};

export const GroupTitle: React.FC<GroupTitleProps> = ({ 
  myName, 
  myPartner, 
  teamName 
}) => {
  return (
    <View style={styles.groupTitleContainer}>
      <Image
        source={require("../../assets/free-icon-crown-6941697.png")}
        style={styles.crownIcon}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.myNameText}>{myName}</Text>
        <Image
          source={require("../../assets/free-icon-hearts-18745836.png")}
          style={styles.heartIcon}
        />
        {typeof myPartner === 'string' ? (
          <Text style={styles.myNameText}>
            {myPartner || teamName || "테스트"}
          </Text>
        ) : myPartner?.type === 'heart' ? (
          <View style={styles.heartPartnersContainer}>
            {myPartner.partners.map((partner, index) => (
              <React.Fragment key={index}>
                <Text style={styles.myNameText}>{partner}</Text>
                {index < myPartner.partners.length - 1 && (
                  <Image
                    source={require("../../assets/free-icon-hearts-18745836.png")}
                    style={styles.heartIcon}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <Text style={styles.myNameText}>
            {teamName || "테스트"}
          </Text>
        )}
      </View>
    </View>
  );
};
